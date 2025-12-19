export interface Program {
  id: number
  slug: string
  title: string
  category: string
  categoryColor: string
  icon: string
  description: string
  image: string
  alt: string
}

export interface ProgramDetail extends Program {
  slug: string
  heroImage: string
  fullDescription: string
  objectives: string[]
  targetAudience: string
  schedule: {
    frequency: string
    duration: string
  }
  locations: string[]
  impact: {
    label: string
    value: string
    icon: string
  }[]
  activities: {
    title: string
    description: string
    icon: string
  }[]
  testimonials?: {
    name: string
    role: string
    quote: string
    avatar?: string
  }[]
  gallery?: string[]
}
