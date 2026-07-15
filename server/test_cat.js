(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@shop.com', password: 'admin123' })
    });
    const loginData = await res.json();
    const token = loginData.token;
    
    // Now create category
    const fd = new FormData();
    fd.append('name', 'Test Category 123');
    fd.append('description', 'Test Description');
    fd.append('parentCategory', ''); // Emulate frontend sending empty string

    const catRes = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: fd
    });
    
    const catData = await catRes.json();
    console.log("Status:", catRes.status);
    console.log("Response:", catData);
  } catch (err) {
    console.error("Error:", err);
  }
})();
