// LUXE Commerce Client Interaction Scripts
document.addEventListener('DOMContentLoaded', () => {
  // 1. Auto-dismiss alerts after 5 seconds
  const alerts = document.querySelectorAll('.alert-dismissible');
  alerts.forEach(alert => {
    setTimeout(() => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) bsAlert.close();
    }, 5000);
  });

  // 2. Quantity selector adjustments in Product Details and Cart
  document.querySelectorAll('.qty-btn-decrease').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = btn.closest('.input-group').querySelector('.qty-input');
      if (input) {
        let val = parseInt(input.value, 10) || 1;
        if (val > 1) {
          input.value = val - 1;
          input.dispatchEvent(new Event('change'));
        }
      }
    });
  });

  document.querySelectorAll('.qty-btn-increase').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = btn.closest('.input-group').querySelector('.qty-input');
      if (input) {
        let val = parseInt(input.value, 10) || 1;
        const max = parseInt(input.getAttribute('max'), 10) || 999;
        if (val < max) {
          input.value = val + 1;
          input.dispatchEvent(new Event('change'));
        } else {
          alert(`Maximum available stock is ${max}.`);
        }
      }
    });
  });

  // 3. Confirm Deletes
  document.querySelectorAll('.confirm-delete-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!confirm('Are you sure you want to proceed with this deletion? This action cannot be undone.')) {
        e.preventDefault();
      }
    });
  });

  // 4. Product Gallery Thumbnail Clicker
  const mainImage = document.getElementById('mainProductImage');
  document.querySelectorAll('.product-thumb-item').forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (mainImage) {
        mainImage.src = thumb.getAttribute('data-src') || thumb.src;
        document.querySelectorAll('.product-thumb-item').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      }
    });
  });

  // 5. Tooltips initialization
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
