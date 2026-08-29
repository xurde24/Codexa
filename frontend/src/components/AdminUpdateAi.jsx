import { useState, useRef, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import toast from 'react-hot-toast';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AdminUpdateAi = ({ formData, onApplyUpdates }) => {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: "Hi! I'm your AI Problem Setter Assistant. I can see your current problem configuration. How can I help you improve or complete it today?" }] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Remove the previous 'updatesApplied' flag so we don't render it repeatedly if we retry
    const userMessage = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/ai/admin-chat', {
        messages: newMessages.map(m => ({ role: m.role, parts: [{ text: m.parts[0].text }] })), // Send only text to backend to avoid schema issues
        formData: formData
      });

      const aiMessage = { 
        role: 'model', 
        parts: [{ text: response.data.message }],
        updatesApplied: response.data.updates && Object.keys(response.data.updates).length > 0 ? Object.keys(response.data.updates) : null
      };

      if (aiMessage.updatesApplied && onApplyUpdates) {
        onApplyUpdates(response.data.updates);
      }

      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error(error);
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#141414] rounded-2xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)] overflow-hidden flex flex-col h-[400px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/40 to-[#141414] px-6 py-4 border-b border-gray-800 flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Sparkles className="text-purple-400" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-100 text-lg">Problem Setter Assistant</h3>
          <p className="text-xs text-gray-400">Ask me to generate test cases, write descriptions, or fix starter code.</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#0A0A0A]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
              msg.role === 'user' 
                ? 'bg-blue-600/20 border border-blue-500/30 text-blue-50' 
                : 'bg-[#1A1A1A] border border-gray-800 text-gray-300'
            }`}>
              {msg.role === 'user' ? (
                <p className="text-sm whitespace-pre-wrap">{msg.parts[0].text}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-[#111] prose-pre:border prose-pre:border-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.parts[0].text}
                    </ReactMarkdown>
                  </div>
                  {msg.updatesApplied && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800/50">
                      <Sparkles size={14} className="text-[#00D26A]" />
                      <span className="text-xs text-gray-400 font-medium">
                        Applied changes to: <span className="text-[#00D26A]">{msg.updatesApplied.join(', ')}</span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-purple-600">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl px-5 py-3 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-purple-400" />
              <span className="text-sm text-gray-400">Analyzing form data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#141414] border-t border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to generate test cases or fix starter code..."
            className="w-full bg-[#0A0A0A] border border-gray-800 focus:border-purple-500 rounded-xl pl-5 pr-12 py-3.5 text-sm text-gray-200 outline-none transition-all focus:ring-1 focus:ring-purple-500/50"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateAi;
