import { useState } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('');
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    setLoading(true);
    setReview('');
    try {
      const response = await axios.post('https://ai-code-reviewer-r99o.onrender.com/api/review', { 
        code: code 
      });
      setReview(response.data);
    } catch {
      setReview("Error: Could not reach the backend. Check if your Render server is live.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🤖 AI Code Reviewer</h1>
      <p>Paste your code below to get instant feedback from Gemini AI.</p>
      
      <textarea 
        value={code} 
        onChange={(e) => setCode(e.target.value)} 
        rows="10" 
        style={{ width: '100%', padding: '10px', fontSize: '16px', marginBottom: '10px' }}
        placeholder="Paste your code here..."
      />
      
      <br />
      <button 
        onClick={handleReview} 
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading ? "Reviewing..." : "Review My Code"}
      </button>

      {review && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
          <h3>Review Results:</h3>
          {review}
        </div>
      )}
    </div>
  );
}

export default App;