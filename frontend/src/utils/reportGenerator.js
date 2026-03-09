import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

// Helper to create a standard table cell
const createCell = (text, isHeader = false) => {
    return new TableCell({
        children: [new Paragraph({
            children: [new TextRun({ text: text?.toString() || '', bold: isHeader })],
            alignment: isHeader ? AlignmentType.CENTER : AlignmentType.LEFT
        })],
        width: { size: 100, type: WidthType.PERCENTAGE },
        margins: { top: 100, bottom: 100, left: 100, right: 100 }
    });
};

export const generateMentalHealthReport = async (mentalHealthData) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: "Campus Mental Health Summary Report",
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Executive Summary",
                            bold: true,
                            size: 28
                        })
                    ],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    text: "This report provides an aggregated overview of the current mental health status across the student body, based on recent clinical screenings (e.g., PHQ-9, GAD-7). The data is categorized by severity to help the counseling department allocate resources effectively and identify broader campus trends.",
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Severity Distribution:",
                            bold: true,
                            size: 24
                        })
                    ],
                    spacing: { after: 200 }
                }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                createCell("Severity Level", true),
                                createCell("Student Count", true)
                            ],
                            tableHeader: true
                        }),
                        ...mentalHealthData.map(item => new TableRow({
                            children: [
                                createCell(item.name),
                                createCell(item.value)
                            ]
                        }))
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE }
                }),
                new Paragraph({
                    spacing: { before: 400, after: 200 },
                    children: [
                        new TextRun({
                            text: "Recommended Actions:",
                            bold: true,
                            size: 24
                        })
                    ]
                }),
                new Paragraph({ text: "1. Review capacity for 'Severe' category follow-ups." }),
                new Paragraph({ text: "2. Consider organizing campus-wide wellness workshops targeting 'Mild' to 'Moderate' groups." })
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Mental_Health_Summary_${new Date().toISOString().split('T')[0]}.docx`);
};

export const generateUtilizationReport = async (appointmentData) => {

    // Safely structure data
    const total = appointmentData?.total || 0;
    const completed = appointmentData?.completed || 0;
    const pending = appointmentData?.pending || 0;
    const cancelled = appointmentData?.cancelled || 0;
    const emergency = appointmentData?.emergency || 0;

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: "Counsellor Engagement & Utilization Report",
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Workload Overview", bold: true, size: 28 })
                    ],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    text: `This report summarizes the recent counseling session workload and scheduling efficiency. Out of ${total} total scheduled appointments, ${emergency} were marked as emergency interventions.`,
                    spacing: { after: 400 }
                }),
                new Table({
                    rows: [
                        new TableRow({
                            children: [
                                createCell("Status", true),
                                createCell("Count", true)
                            ],
                            tableHeader: true
                        }),
                        new TableRow({ children: [createCell("Completed"), createCell(completed)] }),
                        new TableRow({ children: [createCell("Pending/Approved"), createCell(pending + (appointmentData?.approved || 0))] }),
                        new TableRow({ children: [createCell("Cancelled"), createCell(cancelled)] }),
                        new TableRow({ children: [createCell("Emergency (Subset)"), createCell(emergency)] })
                    ],
                    width: { size: 100, type: WidthType.PERCENTAGE }
                })
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Utilization_Report_${new Date().toISOString().split('T')[0]}.docx`);
};

export const generateHighRiskReport = async (highRiskStudents) => {
    const rows = [
        new TableRow({
            children: [
                createCell("Student Name", true),
                createCell("ID / Dept", true),
                createCell("Alert Reason", true),
                createCell("Follow-up Actions / Notes", true)
            ],
            tableHeader: true
        })
    ];

    highRiskStudents.forEach(item => {
        rows.push(new TableRow({
            children: [
                createCell(item.student?.name || 'Unknown'),
                createCell(`${item.student?.universityId || 'N/A'}\n${item.student?.department || ''}`),
                createCell(item.reason),
                createCell("                                  \n                                  \n                                  ") // Blank space for notes
            ]
        }));
    });

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: "High-Risk Intervention Action Plan",
                    heading: HeadingLevel.TITLE,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    text: "CONFIDENTIAL",
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Priority Student List", bold: true, size: 28 })
                    ],
                    spacing: { after: 200 }
                }),
                new Paragraph({
                    text: "The following students have triggered severe assessment scores or high-risk conversation flags. Immediate outreach and intervention planning are required.",
                    spacing: { after: 400 }
                }),
                new Table({
                    rows: rows,
                    width: { size: 100, type: WidthType.PERCENTAGE }
                })
            ]
        }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `High_Risk_Action_Plan_${new Date().toISOString().split('T')[0]}.docx`);
};
