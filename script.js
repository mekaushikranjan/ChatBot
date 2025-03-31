document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const typingIndicator = document.getElementById('typing-indicator');
    const hamburgerButton = document.getElementById('hamburger-button');
    const sidebar = document.getElementById('sidebar');
  
    // Check that all required elements exist
    if (!chatWindow || !chatForm || !messageInput || !typingIndicator || !hamburgerButton || !sidebar) {
      console.error('Missing essential elements. Please check the HTML.');
      return;
    }
  
    // Function to update hamburger visibility based on sidebar state
    function updateHamburgerVisibility() {
      // When sidebar is active, hide hamburger; otherwise, show it.
      if (sidebar.classList.contains('active')) {
        hamburgerButton.style.display = 'none';
      } else {
        hamburgerButton.style.display = 'block';
      }
    }
  
    // Toggle sidebar visibility on hamburger click
    hamburgerButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent click from propagating to document
      sidebar.classList.toggle('active');
      updateHamburgerVisibility();
    });
  
    // Hide sidebar if clicking anywhere outside of it (and outside hamburger button)
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active')) {
        if (!sidebar.contains(e.target) && e.target !== hamburgerButton) {
          sidebar.classList.remove('active');
          updateHamburgerVisibility();
        }
      }
    });
  
    // Update hamburger and sidebar visibility on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        // For larger screens, sidebar should be visible by default and hide hamburger.
        sidebar.classList.remove('active');
        hamburgerButton.style.display = 'none';
      } else {
        hamburgerButton.style.display = 'block';
      }
    });
  
    // Append a message to the chat window
    function appendMessage(role, content) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message', role);
  
      const messageContent = document.createElement('div');
      messageContent.classList.add('message-content');
      messageContent.textContent = content;
  
      messageDiv.appendChild(messageContent);
      chatWindow.appendChild(messageDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the bottom
    }
  
    // Show or hide the typing indicator
    function setTypingIndicator(show) {
      typingIndicator.style.display = show ? 'flex' : 'none';
    }
  
    // Simulate bot typing effect (optional)
    function simulateBotTyping(responseText) {
      return new Promise((resolve) => {
        setTypingIndicator(true);
        const delay = Math.max(500, responseText.length * 40);
        setTimeout(() => {
          setTypingIndicator(false);
          resolve(responseText);
        }, delay);
      });
    }
  
    // Fetch AI response using a backend API
    async function getAIResponse(userMessage) {
      try {
        const response = await fetch('http://localhost:3000/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: userMessage })
        });
  
        if (!response.ok) {
          throw new Error(`Network error: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data.reply || 'No response from AI.';
      } catch (error) {
        console.error('Error fetching AI response:', error.message || error);
        return 'Sorry, something went wrong. Please try again.';
      }
    }
  
    // Form Submission Event
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const userMessage = messageInput.value.trim();
      if (!userMessage) return;
  
      appendMessage('user', userMessage);
      messageInput.value = '';
  
      // Show Typing Indicator
      setTypingIndicator(true);
  
      // Get AI Response and simulate bot typing effect
      try {
        const aiResponse = await getAIResponse(userMessage);
        const finalResponse = await simulateBotTyping(aiResponse);
  
        // If finalResponse is an object with a 'content' property, extract it.
        const replyText = typeof finalResponse === 'object' && finalResponse.content
          ? finalResponse.content
          : finalResponse;
  
        appendMessage('bot', replyText);
      } catch (error) {
        console.error('Error during chat:', error);
        appendMessage('bot', 'Oops! Something went wrong.');
      }
    });
  });
  