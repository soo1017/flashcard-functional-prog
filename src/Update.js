import * as R from 'ramda';

const MSGS = {
  SHOW_FLASHCARDADDFORM: 'SHOW_FLASHCARDADDFORM',
  GET_QUESTION: 'GET_QUESTION',
  GET_ANSWER: 'GET_ANSWER',
  SAVE_FLASHCARD: 'SAVE_FLASHCARD',
  EDIT_FLASHCARD: 'EDIT_FLASHCARD',
  DELETE_FLASHCARD: 'DELETE_FLASHCARD',
  SHOW_ANSWER: 'SHOW_ANSWER',
  GIVE_RANKSCORE: 'GIVE_RANKSCORE',
};

export function showFlashCardAddForm(flashCardOn) {
  return {
    type: MSGS.SHOW_FLASHCARDADDFORM,
    flashCardOn,
  }
}

export function getAnswer(answer) {
  return {
    type: MSGS.GET_ANSWER,
    answer,
  }
}

export function getQuestion(question) {
  return {
    type: MSGS.GET_QUESTION,
    question,
  }
}

export const saveFlashCard = { type: MSGS.SAVE_FLASHCARD };

export function deleteFlashCard(id) {
  return {
    type: MSGS.DELETE_FLASHCARD,
    id,
  }
}

export function editFlashCard(editId) {
  return {
    type: MSGS.EDIT_FLASHCARD,
    editId,
  }
}

export function giveRankScore(editId, rank) {
  return {
    type: MSGS.GIVE_RANKSCORE,
    editId,
    rank,
  }
}

export function showAnswer(editId, answerShown) {
  return {
    type: MSGS.SHOW_ANSWER,
    editId,
    answerShown,
  }
}

function sort(flashCardS) {
  return R.sort((a, b) => a.rank - b.rank, flashCardS)
}

function update(msg, model) {
  switch (msg.type) {
    case MSGS.SHOW_FLASHCARDADDFORM: {
      const { flashCardOn } = msg;
      return { ...model, flashCardOn }
    }
    case MSGS.GET_QUESTION: {
      const { question } = msg;
      return { ...model, question };
    }
    case MSGS.GET_ANSWER: {
      const { answer } = msg;
      return { ...model, answer }
    }
    case MSGS.SAVE_FLASHCARD: {
      const { editId } = model;
      const updatedModel = editId !== null ? 
        editFC(msg, model) : 
        addFC(msg, model);
      return updatedModel;
    }
    case MSGS.EDIT_FLASHCARD: {
      const { editId } = msg;
      const flashCard = R.filter(n => n.id === editId, model.flashCards);
      const { question, answer } = flashCard[0];
      return { ...model, editId, question, answer, flashCardOn: true }
    }
    case MSGS.DELETE_FLASHCARD: {
      const { id } = msg;
      const flashCards = R.filter(
        flashCard => flashCard.id !== id
      , model.flashCards);
      return { ...model, flashCards };
    }
    case MSGS.GIVE_RANKSCORE: {
      const { editId } = msg;
      const flashCards = R.pipe(
        R.map(flashCard => {
          if(flashCard.id === editId) {
            const rank = flashCard.rank + msg.rank;
            return { ...flashCard, rank, answerShown: false }
          }
          return flashCard;
        }),
        sort,
      )(model.flashCards);
      return {
        ...model,
        flashCards,
        editId: null,
      }
    }
    case MSGS.SHOW_ANSWER: {
      const { editId, answerShown } = msg;
      const flashCards = R.map(flashCard => 
        {
          if(flashCard.id === editId) {
            return { ...flashCard, answerShown }
          }
          return flashCard;
        }, model.flashCards);
      return {
        ...model,
        flashCards,
        editId: null,
      } 
    }
  }
}

function addFC(msg, model) {
  const { nextId, question, answer } = model;
  const fc = { id: nextId, question, answer, rank: 0, answerShown: false };
  const flashCards = [...model.flashCards, fc];
  console.log("save-flas: ", flashCards);
  return {
    ...model,
    flashCards,
    nextId: nextId + 1,
    question: '',
    answer: '',
    flashCardOn: false,
  };
}

function editFC(msg, model) {
  const { editId, question, answer } = model;
  const flashCards = R.map(flashCard => {
    if( flashCard.id === editId) {
      return { ...flashCard, question, answer };
    }
    return flashCard;
  }, model.flashCards);
  return {
    ...model,
    flashCards,
    question: '',
    answer: '',
    flashCardOn: false,
    editId: null,
  };
}



export default update;
