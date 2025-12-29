<script lang="ts">
  import { onMount } from 'svelte';
  import { adminApi } from '$lib/utils/adminApi';
  import Icon from '$lib/components/admin/Icons.svelte';
  import Modal from '$lib/components/admin/Modal.svelte';
  import jsPDF from 'jspdf';
  import autoTable from 'jspdf-autotable';

  let donations: any[] = [];
  let loading = true;
  let updatingId: number | null = null;
  let sendingEmailId: number | null = null;
  let filterStatus: string = 'all';
  let searchQuery: string = '';

  // Modal states
  let showModal = false;
  let modalType: 'success' | 'error' | 'confirm' | 'info' = 'success';
  let modalTitle = '';
  let modalMessage = '';
  let emailTarget: { id: number; name: string } | null = null;
  
  // Detail modal
  let showDetailModal = false;
  let detailDonation: any = null;

  // Monthly filter
  const currentDate = new Date();
  let selectedMonth = currentDate.getMonth(); // 0-11
  let selectedYear = currentDate.getFullYear();
  let showAllMonths = true;

  // Generate month options
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Generate year options (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - i);

  onMount(async () => {
    await loadDonations();
  });

  const loadDonations = async () => {
    loading = true;
    try {
      donations = await adminApi.donations.getAll();
    } catch (error) {
      console.error('Failed to load donations:', error);
    } finally {
      loading = false;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    updatingId = id;
    try {
      await adminApi.donations.updateStatus(id, status);
      await loadDonations();
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal mengupdate status';
      showModal = true;
    } finally {
      updatingId = null;
    }
  };

  const sendThankYouEmail = async (id: number, donorName: string) => {
    emailTarget = { id, name: donorName };
    modalType = 'confirm';
    modalTitle = 'Kirim Email Terima Kasih?';
    modalMessage = `Kirim email terima kasih ke ${donorName}?`;
    showModal = true;
  };

  const confirmSendEmail = async () => {
    if (!emailTarget) return;
    
    sendingEmailId = emailTarget.id;
    try {
      await adminApi.donations.sendThankYouEmail(emailTarget.id);
      modalType = 'success';
      modalTitle = 'Berhasil!';
      modalMessage = 'Email terima kasih berhasil dikirim!';
      showModal = true;
    } catch (error) {
      modalType = 'error';
      modalTitle = 'Gagal!';
      modalMessage = 'Gagal mengirim email. Pastikan konfigurasi SMTP sudah benar.';
      showModal = true;
    } finally {
      sendingEmailId = null;
      emailTarget = null;
    }
  };

  const showDonationMessage = (message: string) => {
    modalType = 'info';
    modalTitle = 'Pesan Donatur';
    modalMessage = message;
    showModal = true;
  };

  const showDetail = (donation: any) => {
    detailDonation = donation;
    showDetailModal = true;
  };

  const closeDetailModal = () => {
    showDetailModal = false;
    detailDonation = null;
  };

  // Export functions
  const exportToWord = async () => {
    try {
      // @ts-ignore - Dynamic import
      const docx = await import('docx');
      const { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, AlignmentType, BorderStyle, Shading, convertInchesToTwip } = docx;
      
      const periodText = showAllMonths 
        ? 'Semua Periode' 
        : `${months[selectedMonth]} ${selectedYear}`;
      
      const currentDate = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Header row dengan styling
      const headerRow = new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            shading: { fill: '3B82F6', color: 'FFFFFF' },
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER 
            })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: { fill: '3B82F6', color: 'FFFFFF' },
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Tanggal', bold: true, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER 
            })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: '3B82F6', color: 'FFFFFF' },
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Donatur', bold: true, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER 
            })],
          }),
          new TableCell({
            width: { size: 22, type: WidthType.PERCENTAGE },
            shading: { fill: '3B82F6', color: 'FFFFFF' },
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Email', bold: true, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER 
            })],
          }),
          new TableCell({
            width: { size: 15, type: WidthType.PERCENTAGE },
            shading: { fill: '3B82F6', color: 'FFFFFF' },
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Jumlah', bold: true, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER 
            })],
          }),
          new TableCell({
            width: { size: 10, type: WidthType.PERCENTAGE },
            shading: { fill: '3B82F6', color: 'FFFFFF' },
            children: [new Paragraph({ 
              children: [new TextRun({ text: 'Status', bold: true, color: 'FFFFFF' })],
              alignment: AlignmentType.CENTER 
            })],
          }),
        ],
      });

      // Data rows dengan alternating colors
      const dataRows = filteredDonations.map((d, index) => {
        const bgColor = index % 2 === 0 ? 'F9FAFB' : 'FFFFFF';
        const statusColor = d.paymentStatus === 'completed' ? '10B981' : d.paymentStatus === 'failed' ? 'EF4444' : 'F59E0B';
        
        return new TableRow({
          children: [
            new TableCell({
              shading: { fill: bgColor },
              children: [new Paragraph({ 
                children: [new TextRun({ text: (index + 1).toString() })],
                alignment: AlignmentType.CENTER 
              })],
            }),
            new TableCell({
              shading: { fill: bgColor },
              children: [new Paragraph({ 
                children: [new TextRun({ text: formatDate(d.createdAt), size: 20 })]
              })],
            }),
            new TableCell({
              shading: { fill: bgColor },
              children: [new Paragraph({ 
                children: [new TextRun({ text: d.donorName || 'Anonim', bold: true })]
              })],
            }),
            new TableCell({
              shading: { fill: bgColor },
              children: [new Paragraph({ 
                children: [new TextRun({ text: d.donorEmail || '-', size: 20 })]
              })],
            }),
            new TableCell({
              shading: { fill: bgColor },
              children: [new Paragraph({ 
                children: [new TextRun({ text: formatCurrency(d.amount), bold: true, color: '3B82F6' })],
                alignment: AlignmentType.RIGHT 
              })],
            }),
            new TableCell({
              shading: { fill: bgColor },
              children: [new Paragraph({ 
                children: [new TextRun({ 
                  text: d.paymentStatus.toUpperCase(), 
                  bold: true, 
                  color: statusColor,
                  size: 18
                })],
                alignment: AlignmentType.CENTER 
              })],
            }),
          ],
        });
      });

      const doc = new Document({
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.75),
                right: convertInchesToTwip(0.75),
                bottom: convertInchesToTwip(0.75),
                left: convertInchesToTwip(0.75),
              },
            },
          },
          children: [
            // Logo & Title
            new Paragraph({
              children: [
                new TextRun({ 
                  text: 'LAPORAN DONASI', 
                  bold: true, 
                  size: 32, 
                  color: '1F2937',
                  font: 'Arial'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ 
                  text: 'YAYASAN SAHABAT ANAK', 
                  size: 24, 
                  color: '3B82F6',
                  bold: true,
                  font: 'Arial'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `Periode: ${periodText}`, 
                  size: 22, 
                  color: '6B7280',
                  font: 'Arial'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `Tanggal Cetak: ${currentDate}`, 
                  size: 20, 
                  color: '9CA3AF',
                  italics: true,
                  font: 'Arial'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),

            // Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [headerRow, ...dataRows],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
                left: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
                right: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'E5E7EB' },
              },
            }),

            // Summary Section
            new Paragraph({ text: '', spacing: { before: 300, after: 200 } }),
            new Paragraph({
              children: [
                new TextRun({ text: 'RINGKASAN', bold: true, size: 24, color: '1F2937' })
              ],
              spacing: { after: 150 },
            }),
            new Table({
              width: { size: 50, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { fill: 'EFF6FF' },
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Total Donasi', bold: true, color: '1F2937' })]
                      })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: `${filteredDonations.length} donasi`, bold: true, color: '3B82F6' })],
                        alignment: AlignmentType.RIGHT
                      })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { fill: 'EFF6FF' },
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Total Nominal', bold: true, color: '1F2937' })]
                      })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: formatCurrency(totalAmount.toString()), bold: true, color: '3B82F6', size: 24 })],
                        alignment: AlignmentType.RIGHT
                      })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { fill: 'F0FDF4' },
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Terverifikasi', bold: true, color: '1F2937' })]
                      })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: `${monthlyCompletedCount} donasi`, bold: true, color: '10B981' })],
                        alignment: AlignmentType.RIGHT
                      })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      shading: { fill: 'FEF3C7' },
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Pending', bold: true, color: '1F2937' })]
                      })],
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: `${monthlyPendingCount} donasi`, bold: true, color: 'F59E0B' })],
                        alignment: AlignmentType.RIGHT
                      })],
                    }),
                  ],
                }),
              ],
            }),

            // Footer
            new Paragraph({ text: '', spacing: { before: 400 } }),
            new Paragraph({
              children: [
                new TextRun({ 
                  text: '───────────────────────────────────────────────────────────', 
                  color: 'E5E7EB'
                })
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({ 
                  text: 'Dokumen ini dibuat secara otomatis oleh sistem', 
                  size: 18, 
                  color: '9CA3AF',
                  italics: true
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 100 },
            }),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Laporan-Donasi-${periodText.replace(/\s/g, '-')}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export to Word failed:', error);
      alert('Gagal export ke Word. Pastikan library docx tersedia.');
    }
  };

  const exportToExcel = async () => {
    try {
      // Dynamic import
      const XLSX = await import('xlsx');
      
      const periodText = showAllMonths 
        ? 'Semua Periode' 
        : `${months[selectedMonth]} ${selectedYear}`;
      
      const printDate = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create workbook
      const wb = XLSX.utils.book_new();

      // === SHEET 1: COVER / INFO ===
      const coverData = [
        ['LAPORAN DONASI'],
        ['YAYASAN SAHABAT ANAK'],
        [''],
        [`Periode: ${periodText}`],
        [`Tanggal Cetak: ${printDate}`],
        [''],
        [''],
        ['RINGKASAN LAPORAN'],
        ['Total Donasi', filteredDonations.length + ' donasi'],
        ['Total Nominal', formatCurrency(totalAmount.toString())],
        ['Terverifikasi', monthlyCompletedCount + ' donasi'],
        ['Pending', monthlyPendingCount + ' donasi'],
      ];
      
      const wsCover = XLSX.utils.aoa_to_sheet(coverData);
      
      // Styling untuk cover sheet
      wsCover['!cols'] = [{ wch: 25 }, { wch: 30 }];
      wsCover['!rows'] = [
        { hpt: 30 }, // Row 1 - Title
        { hpt: 25 }, // Row 2 - Subtitle
        { hpt: 10 }, // Row 3 - Spacing
        { hpt: 18 }, // Row 4
        { hpt: 18 }, // Row 5
      ];

      XLSX.utils.book_append_sheet(wb, wsCover, 'Info');

      // === SHEET 2: DATA DONASI ===
      const data = filteredDonations.map((d: any, index: number) => ({
        'No': index + 1,
        'Tanggal': formatDate(d.createdAt),
        'Donatur': d.donorName || 'Anonim',
        'Email': d.donorEmail || '-',
        'Telepon': d.donorPhone || '-',
        'Jumlah (Rp)': parseInt(d.amount),
        'Program': d.programId ? `Program #${d.programId}` : 'Donasi Umum',
        'Status': d.paymentStatus.toUpperCase(),
        'Metode Pembayaran': d.paymentMethod || '-',
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 5 },  // No
        { wch: 18 }, // Tanggal
        { wch: 25 }, // Donatur
        { wch: 30 }, // Email
        { wch: 15 }, // Telepon
        { wch: 18 }, // Jumlah
        { wch: 20 }, // Program
        { wch: 12 }, // Status
        { wch: 20 }, // Metode
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Data Donasi');

      // === SHEET 3: RINGKASAN DETAIL ===
      const summaryDetail = [
        ['RINGKASAN BERDASARKAN STATUS'],
        [''],
        ['Status', 'Jumlah Donasi', 'Total Nominal'],
        [
          'Completed', 
          monthlyCompletedCount,
          filteredDonations.filter((d: any) => d.paymentStatus === 'completed').reduce((sum: number, d: any) => sum + parseInt(d.amount || 0), 0)
        ],
        [
          'Pending', 
          monthlyPendingCount,
          filteredDonations.filter((d: any) => d.paymentStatus === 'pending').reduce((sum: number, d: any) => sum + parseInt(d.amount || 0), 0)
        ],
        [
          'Failed', 
          filteredDonations.filter((d: any) => d.paymentStatus === 'failed').length,
          filteredDonations.filter((d: any) => d.paymentStatus === 'failed').reduce((sum: number, d: any) => sum + parseInt(d.amount || 0), 0)
        ],
        [''],
        ['TOTAL', filteredDonations.length, totalAmount],
        [''],
        [''],
        ['RINGKASAN BERDASARKAN BULAN'],
        [''],
      ];

      // Group by month
      const monthlyGroups: { [key: string]: any[] } = {};
      filteredDonations.forEach((d: any) => {
        const date = new Date(d.createdAt);
        const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
        if (!monthlyGroups[monthYear]) {
          monthlyGroups[monthYear] = [];
        }
        monthlyGroups[monthYear].push(d);
      });

      summaryDetail.push(['Bulan', 'Jumlah Donasi', 'Total Nominal']);
      Object.entries(monthlyGroups).forEach(([monthYear, donations]) => {
        const total = donations.reduce((sum: number, d: any) => sum + parseInt(d.amount || 0), 0);
        summaryDetail.push([monthYear, donations.length, total]);
      });

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryDetail);
      wsSummary['!cols'] = [{ wch: 20 }, { wch: 18 }, { wch: 20 }];
      
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

      // Save file
      XLSX.writeFile(wb, `Laporan-Donasi-${periodText.replace(/\s/g, '-')}.xlsx`);
    } catch (error) {
      console.error('Export to Excel failed:', error);
      alert('Gagal export ke Excel. Pastikan library xlsx tersedia.');
    }
  };

  const exportToPDF = () => {
    try {
      const periodText = showAllMonths 
        ? 'Semua Periode' 
        : `${months[selectedMonth]} ${selectedYear}`;
      
      const printDate = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const doc = new jsPDF('p', 'mm', 'a4'); // Portrait - sama seperti Word
      const pageWidth = 210; // A4 portrait width
      const margin = 25; // Margin 1 inch = ~25mm
      
      // === HEADER - sama seperti Word ===
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('LAPORAN DONASI', pageWidth / 2, 20, { align: 'center' } as any);
      
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text('YAYASAN SAHABAT ANAK', pageWidth / 2, 30, { align: 'center' } as any);
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`Periode: ${periodText}`, pageWidth / 2, 40, { align: 'center' } as any);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(156, 163, 175);
      doc.text(`Tanggal Cetak: ${printDate}`, pageWidth / 2, 48, { align: 'center' } as any);

      // === DATA TABLE - sama seperti Word (5 kolom, tanpa Email) ===
      const tableData = filteredDonations.map((d: any, index: number) => [
        index + 1,
        formatDate(d.createdAt),
        d.donorName || 'Anonim',
        formatCurrency(d.amount),
        d.paymentStatus.toUpperCase(),
      ]);

      autoTable(doc, {
        startY: 58,
        head: [['No', 'Tanggal', 'Donatur', 'Jumlah', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 12,
          halign: 'center',
          cellPadding: { top: 3, bottom: 3, left: 2, right: 2 },
        },
        bodyStyles: {
          fontSize: 11,
          halign: 'center',
          cellPadding: { top: 2.5, bottom: 2.5, left: 2, right: 2 },
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center' },
          1: { cellWidth: 38, halign: 'center' },
          2: { cellWidth: 48, halign: 'center' },
          3: { cellWidth: 40, halign: 'center', fontStyle: 'bold', textColor: [59, 130, 246] },
          4: { cellWidth: 29, halign: 'center', fontStyle: 'bold' },
        },
        didParseCell: function(data: any) {
          // Color coding for status column
          if (data.column.index === 4 && data.section === 'body') {
            const status = data.cell.raw;
            if (status === 'COMPLETED') {
              data.cell.styles.textColor = [16, 185, 129];
              data.cell.styles.fillColor = [240, 253, 244];
            } else if (status === 'PENDING') {
              data.cell.styles.textColor = [245, 158, 11];
              data.cell.styles.fillColor = [255, 251, 235];
            } else if (status === 'FAILED') {
              data.cell.styles.textColor = [239, 68, 68];
              data.cell.styles.fillColor = [254, 242, 242];
            }
          }
        },
        margin: { left: 20, right: 20 },
      });

      // === RINGKASAN SECTION - sama seperti Word ===
      const summaryStartY = (doc as any).lastAutoTable.finalY + 15;
      
      // Title RINGKASAN
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('RINGKASAN', pageWidth / 2, summaryStartY, { align: 'center' } as any);

      // Summary Table - sama seperti Word (70% width, centered)
      const summaryData = [
        ['Total Donasi', `${filteredDonations.length} donasi`],
        ['Total Nominal', formatCurrency(totalAmount.toString())],
        ['Terverifikasi', `${monthlyCompletedCount} donasi`],
        ['Pending', `${monthlyPendingCount} donasi`],
      ];

      const summaryTableWidth = pageWidth * 0.7;
      const summaryMargin = (pageWidth - summaryTableWidth) / 2;

      autoTable(doc, {
        startY: summaryStartY + 8,
        body: summaryData,
        theme: 'plain',
        styles: {
          fontSize: 13,
          cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
          halign: 'center',
          lineWidth: 0.5,
          lineColor: [229, 231, 235],
        },
        columnStyles: {
          0: { 
            fontStyle: 'bold',
            textColor: [31, 41, 55],
            fillColor: [239, 246, 255],
            cellWidth: summaryTableWidth / 2,
          },
          1: { 
            fontStyle: 'bold',
            cellWidth: summaryTableWidth / 2,
          },
        },
        didParseCell: function(data: any) {
          // Color coding untuk summary rows
          if (data.column.index === 1 && data.section === 'body') {
            if (data.row.index === 0) {
              data.cell.styles.textColor = [59, 130, 246];
            } else if (data.row.index === 1) {
              data.cell.styles.textColor = [59, 130, 246];
              data.cell.styles.fontSize = 14;
            } else if (data.row.index === 2) {
              data.cell.styles.textColor = [16, 185, 129];
            } else if (data.row.index === 3) {
              data.cell.styles.textColor = [245, 158, 11];
            }
          }
          // Background untuk label kolom
          if (data.column.index === 0 && data.section === 'body') {
            if (data.row.index === 0 || data.row.index === 1) {
              data.cell.styles.fillColor = [239, 246, 255];
            } else if (data.row.index === 2) {
              data.cell.styles.fillColor = [240, 253, 244];
            } else if (data.row.index === 3) {
              data.cell.styles.fillColor = [254, 243, 199];
            }
          }
        },
        margin: { left: summaryMargin, right: summaryMargin },
      });

      // === FOOTER - sama seperti Word ===
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      const pageHeight = doc.internal.pageSize.height;
      
      if (finalY < pageHeight - 25) {
        // Separator line
        doc.setDrawColor(209, 213, 219);
        doc.setLineWidth(0.5);
        doc.line(margin, finalY, pageWidth - margin, finalY);
        
        // Footer text
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(156, 163, 175);
        doc.text('Dokumen ini dibuat secara otomatis oleh sistem', pageWidth / 2, finalY + 7, { align: 'center' } as any);
      }

      doc.save(`Laporan-Donasi-${periodText.replace(/\s/g, '-')}.pdf`);
    } catch (error) {
      console.error('Export to PDF failed:', error);
      alert(`Gagal export ke PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(parseInt(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  $: filteredDonations = donations.filter(d => {
    const matchesStatus = filterStatus === 'all' || d.paymentStatus === filterStatus;
    const matchesSearch = !searchQuery || 
      d.donorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.donorEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Monthly filter
    let matchesMonth = true;
    if (!showAllMonths) {
      const donationDate = new Date(d.createdAt);
      matchesMonth = donationDate.getMonth() === selectedMonth && 
                     donationDate.getFullYear() === selectedYear;
    }
    
    return matchesStatus && matchesSearch && matchesMonth;
  });

  $: totalAmount = filteredDonations.reduce((sum, d) => sum + parseInt(d.amount || 0), 0);
  $: completedCount = donations.filter(d => d.paymentStatus === 'completed').length;
  $: pendingCount = donations.filter(d => d.paymentStatus === 'pending').length;
  $: monthlyCompletedCount = filteredDonations.filter(d => d.paymentStatus === 'completed').length;
  $: monthlyPendingCount = filteredDonations.filter(d => d.paymentStatus === 'pending').length;
</script>

<svelte:head>
  <title>Kelola Donasi - Admin Panel</title>
</svelte:head>

<div class="p-6 max-w-7xl mx-auto">
  <!-- Header -->
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
      <Icon name="dollar" className="w-8 h-8 text-blue-500" />
      Kelola Donasi
    </h1>
    <p class="text-gray-600">Kelola dan verifikasi donasi yang masuk</p>
  </div>

  <!-- Stats Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Total Donasi</p>
          <p class="text-2xl font-bold text-gray-900">{donations.length}</p>
          <p class="text-xs text-blue-600 font-medium mt-1">{formatCurrency(totalAmount.toString())}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Icon name="dollar" className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Terverifikasi</p>
          <p class="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <Icon name="check" className="w-6 h-6 text-green-500" />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600 mb-1">Pending</p>
          <p class="text-2xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Icon name="clock" className="w-6 h-6 text-orange-500" />
        </div>
      </div>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 mb-6 overflow-hidden">
    <!-- Monthly Filter Section -->
    <div class="bg-blue-600 px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <Icon name="calendar" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 class="text-white font-bold text-lg">Filter Periode</h3>
          <p class="text-blue-100 text-xs">Pilih periode donasi yang ingin ditampilkan</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-4">
      <!-- Period Selector -->
      <div class="bg-white rounded-xl border-2 border-gray-200 p-4">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Toggle All Months -->
          <label class="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              bind:checked={showAllMonths}
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-blue-500 peer-checked:to-blue-600"></div>
            <span class="ml-3 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              {showAllMonths ? 'Semua Periode' : 'Filter Bulan'}
            </span>
          </label>

          {#if !showAllMonths}
            <div class="flex-1 flex flex-wrap items-center gap-3">
              <!-- Month Selector -->
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                  <div class="w-8 h-8 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Icon name="calendar" className="w-4 h-4 text-white" />
                  </div>
                </div>
                <select
                  bind:value={selectedMonth}
                  class="pl-14 pr-10 py-3.5 bg-linear-to-br from-white to-gray-50 border-2 border-blue-200 rounded-xl text-sm font-bold text-gray-800 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 hover:shadow-lg transition-all duration-200 appearance-none cursor-pointer min-w-45 shadow-md group-hover:shadow-xl"
                >
                  {#each months as month, index}
                    <option value={index}>{month}</option>
                  {/each}
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Year Selector -->
              <div class="relative group">
                <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                  <div class="w-8 h-8 bg-linear-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <select
                  bind:value={selectedYear}
                  class="pl-14 pr-10 py-3.5 bg-linear-to-br from-white to-gray-50 border-2 border-orange-200 rounded-xl text-sm font-bold text-gray-800 focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 hover:border-orange-400 hover:shadow-lg transition-all duration-200 appearance-none cursor-pointer min-w-35 shadow-md group-hover:shadow-xl"
                >
                  {#each years as year}
                    <option value={year}>{year}</option>
                  {/each}
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <div class="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-3.5 h-3.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <!-- Decorative accent -->
              </div>

              <!-- Period Stats Badge -->
              <div class="px-5 py-3 bg-blue-400 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20 backdrop-blur-sm hover:scale-105">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Icon name="dollar" className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p class="text-sm font-black text-white leading-tight">{filteredDonations.length} Donasi</p>
                    <p class="text-xs font-bold text-blue-100 leading-tight">{formatCurrency(totalAmount.toString())}</p>
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <!-- All Period Stats -->
            <div class="flex-1 flex justify-end">
              <div class="px-4 py-2.5 bg-linear-to-r from-gray-100 to-gray-200 rounded-xl border-2 border-gray-300">
                <p class="text-sm font-bold text-gray-700">
                  <span class="text-blue-600">{donations.length}</span> Total Donasi
                </p>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Search & Status Filter -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Search -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon name="search" className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari nama atau email donatur..."
            class="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300 transition-all text-sm placeholder-gray-400"
          />
          {#if searchQuery}
            <button
              on:click={() => searchQuery = ''}
              class="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-100 rounded-r-xl transition-colors"
            >
              <Icon name="close" className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          {/if}
        </div>

        <!-- Status Filter -->
        <div class="flex gap-2">
          <button
            on:click={() => filterStatus = 'all'}
            class="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 {filterStatus === 'all' 
              ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'}"
          >
            Semua
          </button>
          <button
            on:click={() => filterStatus = 'pending'}
            class="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 {filterStatus === 'pending' 
              ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'}"
          >
            Pending
          </button>
          <button
            on:click={() => filterStatus = 'completed'}
            class="flex-1 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 {filterStatus === 'completed' 
              ? 'bg-linear-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-105' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'}"
          >
            Completed
          </button>
        </div>
      </div>

      <!-- Export Buttons -->
      {#if filteredDonations.length > 0}
        <div class="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-linear-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Icon name="download" className="w-4 h-4 text-white" />
              </div>
              <span class="text-sm font-bold text-gray-700">Export Laporan:</span>
            </div>
            
            <div class="flex flex-wrap gap-2">
              <button
                on:click={exportToWord}
                class="px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
              >
                <Icon name="file-text" className="w-4 h-4" />
                Word
              </button>
              <button
                on:click={exportToExcel}
                class="px-4 py-2.5 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
              >
                <Icon name="file-text" className="w-4 h-4" />
                Excel
              </button>
              <button
                on:click={exportToPDF}
                class="px-4 py-2.5 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105"
              >
                <Icon name="file-text" className="w-4 h-4" />
                PDF
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  {:else if filteredDonations.length === 0}
    <div class="bg-white rounded-xl p-12 text-center border border-gray-200">
      <Icon name="dollar" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-600 text-lg">
        {searchQuery || filterStatus !== 'all' ? 'Tidak ada donasi yang sesuai filter' : 'Belum ada donasi'}
      </p>
    </div>
  {:else}
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-linear-to-r from-blue-50 to-blue-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Donatur</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Jumlah</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each filteredDonations as donation}
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3">
                  <p class="font-semibold text-gray-800 text-sm">{donation.donorName || 'Anonim'}</p>
                </td>
                <td class="px-4 py-3 font-bold text-blue-600 text-sm">
                  {formatCurrency(donation.amount)}
                </td>
                <td class="px-4 py-3 text-xs text-gray-600">
                  {formatDate(donation.createdAt)}
                </td>
                <td class="px-4 py-3">
                  <select
                    value={donation.paymentStatus}
                    on:change={(e) => updateStatus(donation.id, e.currentTarget.value)}
                    disabled={updatingId === donation.id}
                    class="text-xs px-2 py-1 rounded-full border font-medium
                      {donation.paymentStatus === 'completed' ? 'bg-green-100 text-green-700 border-green-300' : 
                       donation.paymentStatus === 'failed' ? 'bg-red-100 text-red-700 border-red-300' :
                       'bg-yellow-100 text-yellow-700 border-yellow-300'}"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
                <td class="px-4 py-3 text-xs">
                  <div class="flex gap-2">
                    <button
                      on:click={() => showDetail(donation)}
                      class="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                    >
                      <Icon name="eye" className="w-3 h-3" />
                      Detail
                    </button>
                    <button
                      on:click={() => sendThankYouEmail(donation.id, donation.donorName)}
                      disabled={sendingEmailId === donation.id}
                      class="px-3 py-1 bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                    >
                      {#if sendingEmailId === donation.id}
                        <div class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {:else}
                        <Icon name="send" className="w-3 h-3" />
                      {/if}
                      {sendingEmailId === donation.id ? 'Kirim...' : 'Email'}
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

<Modal 
  bind:show={showModal}
  type={modalType}
  title={modalTitle}
  message={modalMessage}
  confirmText={modalType === 'confirm' ? 'Kirim' : 'OK'}
  onConfirm={modalType === 'confirm' ? confirmSendEmail : null}
/>

<!-- Detail Donation Modal -->
{#if showDetailModal && detailDonation}
  <div class="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50 p-4" on:click={closeDetailModal} on:keydown={(e) => e.key === 'Escape' && closeDetailModal()} role="button" tabindex="0">
    <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" on:click|stopPropagation on:keydown|stopPropagation role="dialog" tabindex="-1">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6 pb-4 border-b">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Icon name="dollar" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Detail Donasi</h3>
            <p class="text-sm text-gray-600">ID: #{detailDonation.id}</p>
          </div>
        </div>
        <button on:click={closeDetailModal} class="text-gray-400 hover:text-gray-600 transition-colors">
          <Icon name="close" className="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="space-y-4">
        <!-- Donatur Info -->
        <div class="bg-gray-50 p-4 rounded-xl">
          <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Icon name="user" className="w-5 h-5 text-blue-600" />
            Informasi Donatur
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Nama:</span>
              <span class="text-sm font-medium text-gray-900">{detailDonation.donorName || 'Anonim'}</span>
            </div>
            {#if detailDonation.donorEmail}
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Email:</span>
                <span class="text-sm font-medium text-gray-900">{detailDonation.donorEmail}</span>
              </div>
            {/if}
            {#if detailDonation.donorPhone}
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Telepon:</span>
                <span class="text-sm font-medium text-gray-900">{detailDonation.donorPhone}</span>
              </div>
            {/if}
          </div>
        </div>

        <!-- Donation Info -->
        <div class="bg-blue-50 p-4 rounded-xl">
          <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Icon name="dollar" className="w-5 h-5 text-blue-600" />
            Informasi Donasi
          </h4>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Jumlah:</span>
              <span class="text-lg font-bold text-blue-600">{formatCurrency(detailDonation.amount)}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Program:</span>
              <span class="text-sm font-medium text-gray-900">{detailDonation.programId ? `Program #${detailDonation.programId}` : 'Donasi Umum'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Metode Pembayaran:</span>
              <span class="text-sm font-medium text-gray-900">{detailDonation.paymentMethod || '-'}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Tanggal:</span>
              <span class="text-sm font-medium text-gray-900">{formatDate(detailDonation.createdAt)}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Status:</span>
              <span class="text-xs px-3 py-1 rounded-full border font-medium
                {detailDonation.paymentStatus === 'completed' ? 'bg-green-100 text-green-700 border-green-300' : 
                 detailDonation.paymentStatus === 'failed' ? 'bg-red-100 text-red-700 border-red-300' :
                 'bg-yellow-100 text-yellow-700 border-yellow-300'}">
                {detailDonation.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        <!-- Message -->
        {#if detailDonation.message}
          <div class="bg-green-50 p-4 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="mail" className="w-5 h-5 text-green-600" />
              Pesan Donatur
            </h4>
            <p class="text-sm text-gray-700 italic whitespace-pre-line">"{detailDonation.message}"</p>
          </div>
        {/if}

        <!-- Payment Proof -->
        {#if detailDonation.paymentProof}
          <div class="bg-orange-50 p-4 rounded-xl">
            <h4 class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Icon name="image" className="w-5 h-5 text-orange-600" />
              Bukti Pembayaran
            </h4>
            <a 
              href="http://localhost:3000{detailDonation.paymentProof}" 
              target="_blank"
              class="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Icon name="eye" className="w-4 h-4" />
              Lihat Bukti Pembayaran
            </a>
          </div>
        {/if}
      </div>

      <!-- Footer Actions -->
      <div class="flex gap-3 mt-6 pt-4 border-t">
        <button
          on:click={closeDetailModal}
          class="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
        >
          Tutup
        </button>
        <button
          on:click={() => {
            sendThankYouEmail(detailDonation.id, detailDonation.donorName);
            closeDetailModal();
          }}
          class="flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Icon name="send" className="w-5 h-5" />
          Kirim Email Terima Kasih
        </button>
      </div>
    </div>
  </div>
{/if}
