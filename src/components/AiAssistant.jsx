import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const FullPageEmotionAIChatbot = () => {
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your Emotion AI assistant powered by Gemini. How are you feeling today?", 
      sender: 'bot',
      emotion: 'neutral'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeEmotion, setActiveEmotion] = useState('neutral');
  const messagesEndRef = useRef(null);

  const emotionsData = {
    happy: { icon: '😊', description: 'Joyful, content' },
    sad: { icon: '😢', description: 'Down, melancholy' },
    angry: { icon: '😠', description: 'Frustrated, irritated' },
    neutral: { icon: '😐', description: 'Balanced, calm' },
    surprised: { icon: '😲', description: 'Startled, amazed' },
    fearful: { icon: '😨', description: 'Anxious, worried' },
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectEmotion = (text) => {
    text = text.toLowerCase();
    
    if (text.includes('happy') || text.includes('joy') || text.includes('excited') || text.includes('good')) {
      return 'happy';
    } else if (text.includes('sad') || text.includes('depressed') || text.includes('upset') || text.includes('bad')) {
      return 'sad';
    } else if (text.includes('angry') || text.includes('mad') || text.includes('frustrated') || text.includes('annoyed')) {
      return 'angry';
    } else if (text.includes('surprised') || text.includes('shocked') || text.includes('amazed')) {
      return 'surprised';
    } else if (text.includes('scared') || text.includes('afraid') || text.includes('anxious') || text.includes('nervous')) {
      return 'fearful';
    }
    return 'neutral';
  };

  const generateGeminiResponse = async (userMessage, detectedEmotion) => {
    const API_key = import.meta.env.VITE_API_KEY;
    const prompt = `You are an empathetic AI therapist specializing in emotional support and mental well-being. 
    The user is feeling ${detectedEmotion} and shared: "${userMessage}".

    Please provide a comprehensive response that:
    1. Acknowledges and validates their feelings
    2. Demonstrates deep understanding of their emotional state
    3. Offers thoughtful insights or perspective
    4. Provides gentle guidance or coping strategies if appropriate
    5. Encourages further exploration of their feelings

    Aim for 4-6 thoughtful sentences that create a supportive, non-judgmental space. Maintain a warm, professional tone that balances empathy with helpful suggestions.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_key}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_ONLY_HIGH"
            }
          ],
          generationConfig: {
            temperature: 0.9,
            topP: 1,
            topK: 40,
            maxOutputTokens: 1000,
            stopSequences: []
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      return {
        text: responseText,
        emotion: detectedEmotion
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return {
        text: "I'm having trouble understanding right now. Could you try again?",
        emotion: 'neutral'
      };
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newUserMessage = { 
      text: inputValue, 
      sender: 'user',
      emotion: null
    };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    const detectedEmotion = detectEmotion(inputValue);
    setActiveEmotion(detectedEmotion);
    setIsTyping(true);

    try {
      const botResponse = await generateGeminiResponse(inputValue, detectedEmotion);
      setMessages(prev => [...prev, { 
        text: botResponse.text, 
        sender: 'bot',
        emotion: botResponse.emotion
      }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I encountered an error. Could you try again?", 
        sender: 'bot',
        emotion: 'neutral'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleEmotionSelection = (emotion) => {
    setActiveEmotion(emotion);
    const message = `I'm feeling ${emotion}`;
    setInputValue(message);
  };

  return (
    <div className='p-4 md:p-6 md:ml-64 min-h-screen bg-neutral-900/50 text-white space-y-6 md:space-y-8 border border-white/50'>
      <Sidebar>
        <EmotionHeader>How are you feeling?</EmotionHeader>
        <EmotionGrid>
          {Object.entries(emotionsData).map(([emotion, data]) => (
            <EmotionButton 
              key={emotion}
              emotion={emotion}
              active={activeEmotion === emotion}
              onClick={() => handleEmotionSelection(emotion)}
              className=''
            >
              <EmotionIcon>{data.icon}</EmotionIcon>
              <EmotionLabel>{emotion}</EmotionLabel>
              <EmotionDescription>{data.description}</EmotionDescription>
            </EmotionButton>
          ))}
        </EmotionGrid>
        
        <EmotionAnalysis>
          <AnalysisTitle>Current Emotion Analysis</AnalysisTitle>
          <EmotionIndicator emotion={activeEmotion}>
            <IndicatorIcon>{emotionsData[activeEmotion]?.icon || '😐'}</IndicatorIcon>
            <IndicatorText>
              <strong>{activeEmotion}</strong>
              <p>{emotionsData[activeEmotion]?.description || 'Neutral state'}</p>
            </IndicatorText>
          </EmotionIndicator>
        </EmotionAnalysis>
      </Sidebar>

      <ChatContainer>
        <ChatHeader>
          <h3>Emotion AI Assistant</h3>
          <p>Your personal emotional support companion powered by Gemini</p>
        </ChatHeader>
        
        <ChatMessages>
          {messages.map((message, index) => (
            <Message key={index} sender={message.sender}>
              {message.sender === 'bot' && (
                <BotAvatar emotion={message.emotion || 'neutral'}>
                  {message.emotion ? emotionsData[message.emotion]?.icon : '🤖'}
                </BotAvatar>
              )}
              <MessageBubble sender={message.sender} emotion={message.emotion}>
                {message.text}
              </MessageBubble>
            </Message>
          ))}
          {isTyping && (
            <Message sender="bot">
              <BotAvatar emotion={activeEmotion}>
                {emotionsData[activeEmotion]?.icon || '🤖'}
              </BotAvatar>
              <TypingIndicator>
                <span>•</span>
                <span>•</span>
                <span>•</span>
              </TypingIndicator>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>
        
        <ChatInputContainer>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or how you're feeling..."
          />
          <SendButton onClick={handleSendMessage}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </SendButton>
        </ChatInputContainer>
      </ChatContainer>
    </div>
  );
};

const Sidebar = styled.div`
  width: 100%;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const EmotionHeader = styled.h2`
  color: #ffffffff;
  font-size: 2rem;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 0.5px solid #e1e5eb;
`;

const EmotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
`;

const EmotionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 10px;
  background: ${({ active, emotion }) => 
    active ? `${emotionColors[emotion]}20` : 'black'};
  border: 1px solid ${({ active, emotion }) => 
    active ? emotionColors[emotion] : '#ffececff'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const EmotionIcon = styled.span`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const EmotionLabel = styled.span`
  font-weight: 600;
  color: #0053e1ff;
  text-transform: capitalize;
  margin-bottom: 4px;
`;

const EmotionDescription = styled.span`
  font-size: 0.8rem;
  color: #ffffffff;
  text-align: center;
`;

const EmotionAnalysis = styled.div`
  margin-top: auto;
  padding: 20px;
  background: #bcd1e5ff;
  border-radius: 10px;
`;

const AnalysisTitle = styled.h3`
  color: #2d3748;
  font-size: 1.1rem;
  margin-bottom: 15px;
`;

const EmotionIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fcfcffff;
  border-radius: 8px;
  border-left: 4px solid ${({ emotion }) => emotionColors[emotion] || emotionColors.default};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const IndicatorIcon = styled.span`
  font-size: 1.8rem;
  margin-right: 15px;
`;

const IndicatorText = styled.div`
  strong {
    display: block;
    color: #000000ff;
    text-transform: capitalize;
    margin-bottom: 4px;
  }
  
  p {
    margin: 0;
    color: #718096;
    font-size: 0.9rem;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 20px;
  background: black;
  border-bottom: 0.5px solid #dcdcdcff;
  
  h3 {
    font-size : 30px;
    margin: 0;
    color: #cbd5edff;
  }
  
  p {
    margin: 5px 0 0;
    color: #c5c9cfff;
    font-size: 0.9rem;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: #000000ff;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 15px;
  justify-content: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
  align-items: flex-end;
  gap: 10px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: ${({ sender }) => 
    sender === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0'};
  background: ${({ sender, emotion }) => 
    sender === 'user' 
      ? 'linear-gradient(135deg, #6E48AA 0%, #9D50BB 100%)' 
      : emotion 
        ? `${emotionColors[emotion]}20`
        : '#e5e5ea'};
  color: ${({ sender }) => (sender === 'user' ? 'white' : '#91969dff')};
  border: ${({ sender, emotion }) => 
    sender !== 'user' && emotion ? `1px solid ${emotionColors[emotion]}` : 'none'};
  word-wrap: break-word;
`;

const BotAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ emotion }) => emotionColors[emotion] || emotionColors.default};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #000000ff;
  border-radius: 18px 18px 18px 0;

  span {
    height: 8px;
    width: 8px;
    margin: 0 2px;
    border-radius: 50%;
    display: inline-block;
    opacity: 0.4;
    animation: bounce 1.5s infinite ease-in-out;
  }

  span:nth-child(1) {
    animation-delay: 0s;
  }

  span:nth-child(2) {
    animation-delay: 0.2s;
  }

  span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
      opacity: 0.4;
    }
    50% {
      transform: translateY(-5px);
      opacity: 1;
    }
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 15px 20px;
  background: black;
  border-top: 0.5px solid #e1e5eb;

  input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #e1e5eb;
    border-radius: 20px;
    outline: none;
    font-size: 1rem;
    transition: all 0.2s ease;
    background: #1b1b1bff;

    &:focus {
      border-color: #9D50BB;
      box-shadow: 0 0 0 2px rgba(110, 72, 170, 0.1);
    }
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #6E48AA 0%, #9D50BB 100%);
  border: none;
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(110, 72, 170, 0.3);
  }

  svg {
    fill: white;
  }
`;

const emotionColors = {
    happy: '#FFD700',
    sad: '#1E90FF',
    angry: '#FF4500',
    neutral: '#808080',
    surprised: '#9370DB',
    fearful: '#9932CC',
    disgusted: '#32CD32',
    default: '#6E48AA'
};

export default FullPageEmotionAIChatbot;