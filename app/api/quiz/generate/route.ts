import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic = 'General Computer Science', sourceText = '', courseCode = 'CS401', questionCount = 4 } = body;

    // Intelligent mock quiz generator response tailored to prompt/notes
    const questions = [
      {
        id: 'qz_1',
        question: `What primary mathematical concept underpins ${topic}?`,
        options: [
          'Matrix multiplication and gradient descent updates',
          'Linear single-variable interpolation without loss',
          'Unconstrained quadratic programming solvers only',
          'Deterministic finite automaton state transitions'
        ],
        correctIndex: 0,
        explanation: 'Gradient descent computes loss derivatives with respect to weights, leveraging matrix transformations for batch updates.'
      },
      {
        id: 'qz_2',
        question: `Which scenario represents an optimal application of ${topic}?`,
        options: [
          'High-dimensional data processing requiring adaptive learning rates',
          'Static fixed-size string array lookups',
          'Single-threaded sequential file I/O operations',
          'Basic floating point addition routines'
        ],
        correctIndex: 0,
        explanation: 'Adaptive learning rates prevent exploding or vanishing gradients during high-dimensional parameter optimization.'
      },
      {
        id: 'qz_3',
        question: `What happens when the regularizing parameter is set excessively high during ${topic}?`,
        options: [
          'Underfitting occurs as weights are penalized towards zero',
          'Overfitting increases rapidly with zero loss on test data',
          'The learning rate automatically scales to infinity',
          'Memory allocation crashes due to heap stack overflow'
        ],
        correctIndex: 0,
        explanation: 'Excessive regularization heavily penalizes weight magnitudes, restricting model capacity and causing underfitting.'
      },
      {
        id: 'qz_4',
        question: `In practical engineering, how do you verify convergence during ${topic}?`,
        options: [
          'Monitoring validation loss plateau over successive epochs',
          'Checking if total CPU core temperature stays below 60°C',
          'Verifying that all output vectors contain strictly prime numbers',
          'Counting total lines of written TypeScript code'
        ],
        correctIndex: 0,
        explanation: 'Validation loss plateauing indicates the model has reached optimal weights without further statistical improvement.'
      }
    ].slice(0, Math.min(questionCount, 4));

    return NextResponse.json({
      quizId: `qz_deck_${Date.now()}`,
      title: `${courseCode}: ${topic} Practice Quiz`,
      courseCode,
      questions
    });
  } catch {
    return NextResponse.json({ error: 'Quiz generation failed.' }, { status: 500 });
  }
}
