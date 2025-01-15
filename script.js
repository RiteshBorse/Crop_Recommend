document.getElementById('hamburger').addEventListener('click', () => {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
});

document.getElementById('cropForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const temperature = parseFloat(document.getElementById('temperature').value);
  const humidity = parseFloat(document.getElementById('humidity').value);
  const soilType = document.getElementById('soilType').value;

  if (!soilType || isNaN(temperature) || isNaN(humidity)) {
    alert('Please fill all fields correctly!');
    return;
  }

  let recommendation = 'No recommendation available.';
  if (soilType === 'loamy' && temperature >= 20 && humidity >= 50) {
    recommendation = 'Recommended crop: Rice';
  } else if (soilType === 'sandy' && temperature >= 25 && humidity < 40) {
    recommendation = 'Recommended crop: Millet';
  }

  alert(recommendation);
});
