import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import { 
  showFlashCardAddForm, 
  getQuestion, 
  getAnswer, 
  saveFlashCard,
  editFlashCard,
  deleteFlashCard,
  giveRankScore, 
  showAnswer,
} from './Update';

const { div, h1, pre, button, label, input, form, i, a } = hh(h);

function button1(name, onclick) {
  return button({ 
    className: 'f3 pv2 ph3 bg-blue white bn mr2 dim',
    type: 'button',
    onclick,
  }, name)
}

function button2(name, className, onclick) {
  return button({ 
    className,
    type: 'button',
    onclick,
  }, name)
}

function addButtonSet(dispatch) {
  return div({ className: '' }, 
    button1('+ Add Flash Card', () => dispatch(showFlashCardAddForm(true)))
  )
}

function saveButtonSet() {
  return div([
    button(
      {
        className: 'f3 pv2 ph3 bg-light-blue black bn mr2 dim',
        type: 'submit',
      },
      'Save',
    ),]
  )
}

function input1(labelText, value, oninput) {
  return div([
    label({ className: 'db mb1 f4' }, labelText),
    input({
      className: 'pa2 input-reset ba w-100 mb2',
      type: 'text',
      value,
      oninput,
    }),
  ]);
}

function saveFlashCardSet(dispatch, model) {
  const { question, answer } = model;
  // return div({ className: 'w-32 pa2 ma1 bg-light-yellow bn br3 shadow-4 relative'}, 
  return div({ className: 'w-third pa2'}, 
    div({ className: 'w-100 pa2 bg-light-yellow bn br3 shadow-4 relative'}, 
      [
        i({ 
          className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer',
          onclick: () => dispatch(showFlashCardAddForm(false)),
        }),
        form(
          {
            className: 'w-90 center mv2',
            onsubmit: e => {
              e.preventDefault();
              dispatch(saveFlashCard);
            },
          },
          [
            input1('Question', question,
              e => dispatch(getQuestion(e.target.value))
            ),
            input1('Answer', answer || '',
              e => dispatch(getAnswer(e.target.value))
            ),
            saveButtonSet(),
          ],
        )
      ]
    )
  )
}

function oneFlashCardSet(dispatch, flashCard) {
  console.log("oneFlashCardSet - flashCard: ", flashCard);
  if (flashCard.answerShown) {
    return div({ className: 'w-third pa2'}, 
      div({ className: 'w-100 pa2 bg-light-yellow bn br3 shadow-4 relative' }, 
        [
          i({
            className: 'absolute top-0 right-2 fa fa-pencil-square-o fa-fw black-50 pointer',
            onclick: () => dispatch(editFlashCard(flashCard.id)),
          }),
          i({ 
            className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer',
            onclick: () => dispatch(deleteFlashCard(flashCard.id)),
          }),
          div({ className: 'relative mt3'},
            [
              div({ className: 'b f6 mv1 underline' }, 'Question'),
              div({ className: 'pointer' }, flashCard.question),
            ]
          ),
          div({ className: 'relative'},
            [
              div({ className: 'b f6 mv1 underline' }, 'Answer'),
              div({ className: 'pointer' }, flashCard.answer),
            ]
          ),
          div({ className: 'relative bottom-0 left-0 w-100 ph2'}, 
          // div({ className: 'absolute bottom-0 left-0 w-100 ph2'}, 
            div({ className: 'mv2 flex justify-between'}, 
              [
                button2('Bad', 'f4 ph3 pv2 bg-red bn white br1', 
                  () => dispatch(giveRankScore(flashCard.id, 0))
                ),
                button2('Good', 'f4 ph3 pv2 bg-blue bn white br1', 
                  () => dispatch(giveRankScore(flashCard.id, 1))
                ),
                button2('Great', 'f4 ph3 pv2 bg-dark-green bn white br1', 
                  () => dispatch(giveRankScore(flashCard.id, 2))
                )
              ]
            ),
          ),
        ]
      )
    )
  } else {
    // return div({ className: 'w-32 pa2 ma1 bg-light-yellow bn br3 shadow-4 relative' }, 
    return div({ className: 'w-third pa2'}, 
      div({ className: 'w-100 pa2 bg-light-yellow bn br3 shadow-4 relative' }, 
        [
          i({
            className: 'absolute top-0 right-2 fa fa-pencil-square-o fa-fw black-50 pointer',
            onclick: () => dispatch(editFlashCard(flashCard.id)),
          }),
          i({ 
            className: 'absolute top-0 right-0 fa fa-remove fa-fw black-50 pointer',
            onclick: () => dispatch(deleteFlashCard(flashCard.id)),
          }),
          div({ className: 'relative mt3'},
            [
              div({ className: 'b f6 mv1 underline' }, 'Question'),
              div({ className: 'pointer' }, flashCard.question),
            ]
          ),
          div(a(
            { 
              className: 'f6 mv1 link pointer',
              onclick: () => dispatch(showAnswer(flashCard.id, true)) 
            }, 
            'Show Answer')
          ),
        ]
      )
    )
  }
}

const curriedoneFlashCardSet = R.curry((dispatch1, flashCardS1) => 
  R.pipe(
    R.map(n => oneFlashCardSet(dispatch1, n)),
  )(flashCardS1)
);

function flashCardsSet(dispatch, flashCardS) {
  if(flashCardS.length) {
    return curriedoneFlashCardSet(dispatch, flashCardS)
  }
}

function mainView(dispatch, model) {
  const { flashCardOn, flashCards } = model;
  if (flashCardOn) {
    return div(
      { className: 'flex flex-wrap items-start nl2 nr2 mt3'},
      [
        saveFlashCardSet(dispatch, model),
        flashCardsSet(dispatch, flashCards),
      ]
    )
  } else {
    return div(
      { className: 'flex flex-wrap items-start nl2 nr2 mt3'},
      [
        flashCardsSet(dispatch, flashCards),
      ]
    )
  }
  
}

function view(dispatch, model) { 
  return div({ className: 'mw8 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Flashcard Study'),
    addButtonSet(dispatch),
    mainView(dispatch, model),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
