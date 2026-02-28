'use client';

export default function PdfExportButton({ filename }: { filename: string }) {
    const exportPDF = async () => {
        // Dynamic import to avoid SSR issues with html2pdf which uses window
        const html2pdf = (await import('html2pdf.js')).default;

        const element = document.getElementById('proposal-content-pdf');
        if (!element) return;

        // Create a clone without the dark mode styles for printing
        const opt = {
            margin: [10, 10, 10, 10] as [number, number, number, number], // top, left, buttom, right in mm
            filename: filename + '.pdf',
            image: { type: 'jpeg' as "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as "portrait" },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        html2pdf().set(opt as any).from(element).save();
    };

    return (
        <button className="btn-secondary" onClick={exportPDF}>
            ⬇ Baixar PDF
        </button>
    );
}
