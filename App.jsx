import { useState } from 'react';

export default function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'qwen3:4b', prompt: input, stream: false }),
      });
      const data = await res.json();
      setMessages([...messages, userMessage, { role: 'bot', content: data.response }]);
    } catch (err) {
      setMessages([...messages, userMessage, { role: 'bot', content: 'Viga serveriga suhtlemisel.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Qwen3 Chat (lokalne)</h1>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-2 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-blue-200 self-end text-right' : 'bg-gray-200 self-start'}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-sm italic">Laeb...</div>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 rounded border"
          placeholder="Sisesta küsimus..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Saada
        </button>
      </div>
    </div>
  );
}
