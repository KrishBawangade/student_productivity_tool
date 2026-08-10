import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, mode = 'general' } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt query is required.' }, { status: 400 });
    }

    let responseText = '';
    let codeSnippet = '';

    if (mode === 'eli5') {
      responseText = `Imagine ${prompt} is like a post office delivering mail! Instead of checking every house one-by-one, the postman uses zip codes (indexing) to deliver letters directly to the right street in seconds. That's how it achieves optimal time efficiency!`;
    } else if (mode === 'socratic') {
      responseText = `Let's break this down together! 🤔\n\n1. What happens if the input size doubles?\n2. Which mathematical property guarantees lower bound convergence?\n3. How would you store the state before executing the next step?`;
    } else if (mode === 'formula') {
      responseText = `Mathematical Formula Breakdown for ${prompt}:\n\n$$\\text{Loss} = -\\frac{1}{N} \\sum_{i=1}^{N} \\left[ y_i \\log(\\hat{y}_i) + (1-y_i) \\log(1-\\hat{y}_i) \\right]$$\n\n• $N$: Total number of training samples.\n• $y_i$: Binary ground-truth label (0 or 1).\n• $\\hat{y}_i$: Predicted probability output from model activation.`;
      codeSnippet = `import numpy as np\n\ndef binary_cross_entropy(y_true, y_pred):\n    epsilon = 1e-15\n    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)\n    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))`;
    } else {
      responseText = `Here is a concise breakdown of **${prompt}**:\n\n1. **Core Concept:** It isolates key variables and systematically minimizes redundant calculations.\n2. **Complexity:** Standard time complexity runs in $O(N \\log N)$ with $O(1)$ auxiliary space.\n3. **Practical Application:** Widely used in distributed engines, compiler optimization passes, and memory allocators.`;
      codeSnippet = `// Implementation Example\nfunction solveProblem(input) {\n  let cache = new Map();\n  if (cache.has(input)) return cache.get(input);\n  let res = input.reduce((acc, curr) => acc + curr, 0);\n  cache.set(input, res);\n  return res;\n}`;
    }

    return NextResponse.json({
      text: responseText,
      codeSnippet: codeSnippet || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch {
    return NextResponse.json({ error: 'Copilot query failed.' }, { status: 500 });
  }
}
