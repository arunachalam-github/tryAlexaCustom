const Alexa = require('ask-sdk-core');

const welcomeMessage = `Welcome to the India Quiz Game!  You can ask me about India and their capitals, or you can ask me to start a quiz.  What would you like to do?`;

const helpMessage = `I know more about India, you can ask me about India or you can ask me to take a quiz`;
const exitMessage = `Thank you for playing the India Quiz Game!  Let's play again soon!`;
const repromptSpeech = `Which other state or capital would you like to know about?`;

const tellmeaboutMessage = `India is second largest country in population`;


/* INTENT HANDLERS */

// LaunchRequestHandler is the entry to Alexa speach system. Welcome message is part of LanchHandler
const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(welcomeMessage)
        .reprompt(helpMessage)
        .getResponse();
    },
};


const TellMeAboutHandler = {
	canHandle(handlerInput) { 
		const request = handlerInput.requestEnvelope.request;
		return request.type === "IntentRequest" &&
            request.intent.name === "TellMeAboutIntent";
	},
    handle(handlerInput) { 
        const response = handlerInput.responseBuilder;
		return response.speak(tellmeaboutMessage)
            .reprompt(repromptSpeech)
            .getResponse();
	}
}

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
		return request.type === "IntentRequest" &&
            request.intent.name === "AMAZON.HelpIntent";
    },
    handle(handlerInput) {
        const response = handlerInput.responseBuilder;
        return response.speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RepeatHandler = {
    canHandle(handlerInput) {
    // console.log("Inside RepeatHandler");
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      const request = handlerInput.requestEnvelope.request;
  
      return attributes.state === states.QUIZ &&
             request.type === 'IntentRequest' &&
             request.intent.name === 'AMAZON.RepeatHandler';
    },
    handle(handlerInput) {
    // console.log("Inside RepeatHandler - handle");
      const attributes = handlerInput.attributesManager.getSessionAttributes();

      return handlerInput.responseBuilder
        .speak(tellmeaboutMessage)
        .reprompt(tellmeaboutMessage)
        .getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
      console.log("Inside ErrorHandler");
      return true;
    },
    handle(handlerInput, error) {
    //   console.log(`Error handled: ${JSON.stringify(error)}`);
    //   console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);
      return handlerInput.responseBuilder
        .speak(helpMessage)
        .reprompt(helpMessage)
        .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
    //   console.log("Inside ExitHandler");
      const attributes = handlerInput.attributesManager.getSessionAttributes();
      const request = handlerInput.requestEnvelope.request;
  
      return request.type === `IntentRequest` && (
                request.intent.name === 'AMAZON.StopIntent' ||
                request.intent.name === 'AMAZON.PauseIntent' ||
                request.intent.name === 'AMAZON.CancelIntent'
             );
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(exitMessage)
        .getResponse();
    },
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* LAMBDA SETUP */
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    TellMeAboutHandler,
    RepeatHandler,
    HelpHandler,
    ExitHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();