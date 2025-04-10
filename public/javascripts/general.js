// Fonction pour afficher la section correspondante et mettre à jour les boutons
function afficherSection(section) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.infos');
    sections.forEach(sec => {
        sec.style.display = 'none';
    });

    // Afficher la section correspondante
    const sectionActive = document.getElementById(section);
    if (sectionActive) {
        sectionActive.style.display = 'block';
    }

    // Mettre à jour l'état des boutons
    const buttons = document.querySelectorAll('.buttons-container button');
    buttons.forEach(button => {
        // Retirer la classe active de tous les boutons
        button.classList.remove('active');

        // Ajouter la classe active au bouton correspondant
        if (button.id === 'btn-' + section) {
            button.classList.add('active');
        }
    });
}

// Ajouter des event listeners aux boutons de la navbar
document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll('.buttons-container button');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Vérifier quel bouton a été cliqué et afficher la section correspondante
            if (button.id === 'btn-informations') {
                afficherSection('informations');
            } else if (button.id === 'btn-security') {
                afficherSection('security');
            } else if (button.id === 'btn-projet') {
                afficherSection('projet');
            }
        });
    });

    // Afficher par défaut la section "Informations" au chargement de la page
    afficherSection('informations');
});
