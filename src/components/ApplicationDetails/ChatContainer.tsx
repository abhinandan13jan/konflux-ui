import React from 'react';
import ChatBot from 'react-chatbotify';

type WhatsonRequest = {
  currentRequest: string;
  requestState: string;
};

const createWatSonRequestData = (input) => {
  const clusterUrl = '/whatsonX';
  const url = `${clusterUrl}/v2/assistants?version=2021-11-27`;
  const token = 'cL6pnNvhu7O4ESNz9N3Q2aMdYqyZbauOfeaTomR7lhn3';
  const apiKey = `apikey:${token}`;
  const method = 'post';
  const headers = {
    Authorization: `Basic ${btoa(apiKey)}`,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
  };
  const requestData = {
    name: 'API test assistant',
    language: 'en',
    description: 'Example assistant created using API.',
    input,
  };
  return { url, method, headers, requestData };
};

const getWhatsonResponse = async (query) => {
  const followUps = [
    'Is there anything else I can help you with?',
    'Are there any other queries?',
    'Any other help I could offer?',
    'What else is up?',
    'Would you like to get info on something else',
  ];

  const followup = followUps[Math.floor(Math.random() * 5)];

  const { url, method, headers, requestData } = createWatSonRequestData(query);

  try {
    const response = await fetch(url, { method, headers, body: JSON.stringify(requestData) })
      .then((data) => `Whatson responded with "${JSON.stringify(data)}". ${followup}`)
      .catch((error) => JSON.stringify(error));
    return response;
  } catch (e) {
    return 'Failed to connect to WhatsonX';
  }
};

export const ChatContainer: React.FC = () => {
  const [requests, setRequests] = React.useState<WhatsonRequest[]>([]);

  const settings = {
    isOpen: true,
    general: {
      primaryColor: '#ffa500',
      secondaryColor: '#fc783d',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      title: 'Konflux chat assistant',
      showAvatar: false,
    },
    footer: {
      text: 'Powered by WhatsonX',
    },
    tooltip: {
      text: 'Open assistant',
    },
  };

  const flow = {
    start: {
      message: 'Hello there! How can I help you?',
      function: (params) =>
        setRequests([...requests, { currentRequest: params.userInput, requestState: 'sending' }]),
      path: 'sending',
    },
    sending: {
      message: async (params) => await getWhatsonResponse(params.userInput),
      function: () => {},
      chatDisabled: true,
      path: 'response',
    },
    response: {
      message: async (params) => await getWhatsonResponse(params.userInput),
      chatDisabled: true,
      path: 'sending',
    },
  };
  return (
    <div className="application-details__chat-container">
      <ChatBot flow={flow} settings={settings} />
    </div>
  );
};
