// Configuration pour générer le PDF
document.addEventListener('DOMContentLoaded', function() {
    const printBtn = document.getElementById('printBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    const cvContent = document.getElementById('cv-content');
    
    // Fonction d'impression
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Fonction de génération PDF
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            // Options pour le PDF
            const options = {
                margin: [15, 15, 15, 15],
                filename: 'CV_Adrian_Engelsen.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait',
                    compress: true
                },
                // Pour une meilleure qualité d'impression
                pagebreak: { 
                    mode: ['avoid-all', 'css', 'legacy'] 
                }
            };
            
            // Afficher un message de chargement
            pdfBtn.innerHTML = '<span>⏳</span> Génération...';
            pdfBtn.disabled = true;
            
            // Générer le PDF
            html2pdf().set(options).from(cvContent).save().then(() => {
                // Réinitialiser le bouton
                pdfBtn.innerHTML = '<span>📄</span> Télécharger PDF';
                pdfBtn.disabled = false;
                
                // Notification visuelle
                showNotification('PDF téléchargé avec succès !');
            }).catch(err => {
                console.error('Erreur génération PDF:', err);
                pdfBtn.innerHTML = '<span>📄</span> Télécharger PDF';
                pdfBtn.disabled = false;
                showNotification('Erreur lors de la génération', true);
            });
        });
    }
    
    // Fonction de notification
    function showNotification(message, isError = false) {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${isError ? '#ff6b6b' : 'var(--accent-strong)'};
            color: white;
            border-radius: 6px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Ajouter les styles d'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Optimiser les liens pour l'impression
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.setAttribute('data-print-href', link.href);
    });
});