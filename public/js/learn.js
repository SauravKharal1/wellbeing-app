async function fetchFact(category) {
    const response = await fetch('/api/facts/' + category);
    const data = await response.text();
    return data;
  }
  
  async function loadFact(category) {
    const fact = await fetchFact(category);
    document.getElementById(category + 'Fact').innerText = fact;
  }
  
  loadFact('nutrition');
  loadFact('fitness');
  loadFact('lifestyle');
  