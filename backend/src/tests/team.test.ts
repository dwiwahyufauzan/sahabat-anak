import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { db } from '../db';
import { teamMembers } from '../db/schema';
import { eq } from 'drizzle-orm';
import { TeamController } from '../controllers/team.controller';

describe('Team Members Tests', () => {
  let testTeamMemberId: number;

  afterAll(async () => {
    // Cleanup
    if (testTeamMemberId) {
      await db.delete(teamMembers).where(eq(teamMembers.id, testTeamMemberId));
    }
  });

  test('TeamController.create - should create team member', async () => {
    const memberData = {
      name: 'Test Member',
      role: 'Developer',
      bio: 'Test bio',
      image: 'https://example.com/image.jpg',
      order: 1
    };

    const result = await TeamController.create(memberData);
    
    expect(result).toHaveProperty('id');
    testTeamMemberId = result.id;
  });

  test('TeamController.getAll - should return all active team members', async () => {
    const members = await TeamController.getAll();
    
    expect(Array.isArray(members)).toBe(true);
  });

  test('TeamController.getById - should return team member by id', async () => {
    // Create test member
    const [result] = await db.insert(teamMembers).values({
      name: 'Get Test Member',
      role: 'Tester',
      bio: 'Test bio',
      order: 1
    });

    const memberId = result.insertId;
    const member = await TeamController.getById(memberId);
    
    expect(member).toBeDefined();
    expect(member.name).toBe('Get Test Member');
    
    // Cleanup
    await db.delete(teamMembers).where(eq(teamMembers.id, memberId));
  });

  test('TeamController.getById - should throw error for non-existent member', async () => {
    await expect(TeamController.getById(99999)).rejects.toThrow('Team member not found');
  });

  test('TeamController.update - should update team member', async () => {
    // Create test member
    const [result] = await db.insert(teamMembers).values({
      name: 'Update Test',
      role: 'Original Role',
      bio: 'Original bio',
      order: 1
    });

    const memberId = result.insertId;
    
    await TeamController.update(memberId, {
      role: 'Updated Role',
      bio: 'Updated bio'
    });
    
    const [updated] = await db.select().from(teamMembers).where(eq(teamMembers.id, memberId));
    expect(updated.role).toBe('Updated Role');
    expect(updated.bio).toBe('Updated bio');
    expect(updated.name).toBe('Update Test'); // Should not change
    
    // Cleanup
    await db.delete(teamMembers).where(eq(teamMembers.id, memberId));
  });

  test('TeamController.delete - should delete team member', async () => {
    // Create test member
    const [result] = await db.insert(teamMembers).values({
      name: 'Delete Test',
      role: 'To Be Deleted',
      order: 1
    });

    const memberId = result.insertId;
    
    await TeamController.delete(memberId);
    
    const deleted = await db.select().from(teamMembers).where(eq(teamMembers.id, memberId));
    expect(deleted.length).toBe(0);
  });

  test('Team member should have default active status', async () => {
    const [result] = await db.insert(teamMembers).values({
      name: 'Status Test',
      role: 'Tester',
      order: 1
    });

    const memberId = result.insertId;
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, memberId));
    
    expect(member.isActive).toBe(1);
    
    // Cleanup
    await db.delete(teamMembers).where(eq(teamMembers.id, memberId));
  });

  test('Team member order should be settable', async () => {
    const [result] = await db.insert(teamMembers).values({
      name: 'Order Test',
      role: 'Tester',
      order: 5
    });

    const memberId = result.insertId;
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, memberId));
    
    expect(member.order).toBe(5);
    
    // Cleanup
    await db.delete(teamMembers).where(eq(teamMembers.id, memberId));
  });
});
