// activity_filter.js
document.addEventListener('DOMContentLoaded', function() {
    const filterType = document.getElementById('filter-type');
    const filterService = document.getElementById('filter-service');
    const filterCategory = document.getElementById('filter-category');
    const sortSelect = document.getElementById('sort-select');
    
    // Select all activity cards inside the grid
    const cards = Array.from(document.querySelectorAll('.activity-card'));
    
    function applyFilterAndSort() {
        const type = filterType ? filterType.value : '';
        const service = filterService ? filterService.value : '';
        const category = filterCategory ? filterCategory.value : '';
        const sort = sortSelect ? sortSelect.value : 'newest';
        
        // 1. Filtering
        cards.forEach(card => {
            let show = true;
            if (type && card.dataset.type !== type) show = false;
            if (service && card.dataset.service !== service) show = false;
            if (category && card.dataset.category !== category) show = false;
            
            // Toggle display based on filter
            card.style.display = show ? '' : 'none';
        });
        
        // 2. Sorting
        cards.sort((a, b) => {
            if (sort === 'newest') {
                return parseInt(b.dataset.mouid) - parseInt(a.dataset.mouid);
            } else if (sort === 'oldest') {
                return parseInt(a.dataset.mouid) - parseInt(b.dataset.mouid);
            } else if (sort === 'date_newest') {
                return (b.dataset.date || '').localeCompare(a.dataset.date || '');
            } else if (sort === 'date_oldest') {
                return (a.dataset.date || '').localeCompare(b.dataset.date || '');
            } else if (sort === 'budget_high') {
                return parseFloat(b.dataset.budget || 0) - parseFloat(a.dataset.budget || 0);
            } else if (sort === 'budget_low') {
                return parseFloat(a.dataset.budget || 0) - parseFloat(b.dataset.budget || 0);
            }
            return 0;
        });
        
        // 3. Apply sorting using CSS Grid 'order'
        cards.forEach((card, index) => {
            card.style.order = index;
        });
    }

    // Attach event listeners
    if(filterType) filterType.addEventListener('change', applyFilterAndSort);
    if(filterService) filterService.addEventListener('change', applyFilterAndSort);
    if(filterCategory) filterCategory.addEventListener('change', applyFilterAndSort);
    if(sortSelect) sortSelect.addEventListener('change', applyFilterAndSort);
});
