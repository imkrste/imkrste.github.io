document.getElementById('giveawayForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    const csvContent = `data:text/csv;charset=utf-8,Name,Email\n${name},${email}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "giveaway_entries.csv");
    document.body.appendChild(link);
    
    link.click();
});
