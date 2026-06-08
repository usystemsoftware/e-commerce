(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@shop.com', password: 'admin123' })
    });
    const loginData = await res.json();
    const token = loginData.token;
    
    // First fetch categories to get a valid ID
    const catListRes = await fetch('http://localhost:5000/api/categories/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const catList = await catListRes.json();
    const parentId = catList[0]._id;
    
    const fd = new FormData();
    fd.append('name', 'Test Subcategory');
    fd.append('parentCategory', parentId);

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
