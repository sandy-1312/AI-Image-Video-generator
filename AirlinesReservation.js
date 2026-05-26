const tbody = document.querySelector('#flights-table tbody');
    const msg = document.getElementById('message');
    const refreshBtn = document.getElementById('refresh');

    async function loadFlights() {
      msg.textContent = '';
      tbody.innerHTML = '<tr><td colspan="4" class="muted">Loading...</td></tr>';
      try {
        const res = await fetch('/flights');
        const data = await res.json();
        tbody.innerHTML = '';
        if (!data.flights || data.flights.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4">No flights found</td></tr>';
          return;
        }
        data.flights.forEach(f => {
          const tr = document.createElement('tr');
          const actionBtn = document.createElement('button');
          actionBtn.className = 'btn btn-primary';
          actionBtn.textContent = 'Reserve';
          actionBtn.disabled = f.seats <= 0;
          actionBtn.title = actionBtn.disabled ? 'No seats available' : `Reserve one seat on ${f.flight}`;
          actionBtn.onclick = () => reserve(f.flight);

          const tdFlight = document.createElement('td');
          tdFlight.textContent = f.flight;

          const tdDetails = document.createElement('td');
          tdDetails.textContent = f.raw;

          const tdSeats = document.createElement('td');
          tdSeats.textContent = f.seats;

          const tdAction = document.createElement('td');
          tdAction.appendChild(actionBtn);

          tr.appendChild(tdFlight);
          tr.appendChild(tdDetails);
          tr.appendChild(tdSeats);
          tr.appendChild(tdAction);

          tbody.appendChild(tr);
        });
      } catch (e) {
        tbody.innerHTML = '<tr><td colspan="4">Error loading flights</td></tr>';
        console.error(e);
      }
    }

    async function reserve(flight) {
      msg.textContent = 'Reserving...';
      try {
        const res = await fetch('/reserve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ flight })
        });
        const data = await res.json();
        msg.textContent = data.message || (data.success ? 'Reserved' : 'Failed');
        await loadFlights();
      } catch (e) {
        msg.textContent = 'Request failed';
        console.error(e);
      }
    }

    refreshBtn.addEventListener('click', loadFlights);
    loadFlights();
