async function testRegistration() {
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Shanta',
        email: 'test_shanta_' + Date.now() + '@example.com',
        password: 'Password123',
        role: 'CUSTOMER'
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log('Registration Success:', data);
    } else {
      console.error('Registration Failed:', data);
    }
  } catch (err) {
    console.error('Network Error:', err.message);
  }
}

testRegistration();
