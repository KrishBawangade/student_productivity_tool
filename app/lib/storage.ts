import { Task, Flashcard, CourseGrade, UserProfile, StudySession, QuizAttempt, NoteItem } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Vance',
  rankTitle: 'Academic Architect',
  level: 14,
  xp: 2450,
  nextLevelXp: 3500,
  streak: 7,
  totalFocusMinutes: 420,
  completedTasks: 18,
  masteredCards: 34,
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Implement Neural Net Backpropagation',
    course: 'CS401 AI',
    dueDate: 'Today, 11:59 PM',
    priority: 'high',
    xp: 50,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Linear Algebra Eigenvalues & Eigenvectors HW',
    course: 'MATH302',
    dueDate: 'Tomorrow',
    priority: 'medium',
    xp: 35,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Read System Architecture Chapter 4',
    course: 'CS310',
    dueDate: 'Aug 12',
    priority: 'low',
    xp: 20,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Prepare Physics Lab Oscilloscope Report',
    course: 'PHYS201',
    dueDate: 'Aug 14',
    priority: 'high',
    xp: 50,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't5',
    title: 'Review Operating Systems Semaphore Mutex Notes',
    course: 'CS305 OS',
    dueDate: 'Aug 15',
    priority: 'medium',
    xp: 35,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    question: 'What is the average time complexity of QuickSort algorithm?',
    answer: 'O(n log n). Partitioning recursively divides the array around a pivot.',
    topic: 'Data Structures',
    codeSnippet: `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.filter(x => x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}`,
    difficulty: 'Medium',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    mastered: false,
  },
  {
    id: 'f2',
    question: 'Explain the difference between L1 and L2 Regularization in ML.',
    answer: 'L1 (Lasso) adds absolute values of weights to loss, shrinking weights to 0 (feature selection). L2 (Ridge) adds squared weights, penalizing large magnitudes.',
    topic: 'Machine Learning',
    difficulty: 'Hard',
    easeFactor: 2.3,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    mastered: false,
  },
  {
    id: 'f3',
    question: 'What is the CAP Theorem in Distributed Systems?',
    answer: 'A distributed data store can simultaneously provide at most TWO out of three guarantees: Consistency, Availability, and Partition Tolerance.',
    topic: 'Systems Architecture',
    difficulty: 'Easy',
    easeFactor: 2.6,
    interval: 6,
    repetitions: 2,
    dueDate: new Date().toISOString(),
    mastered: true,
  },
  {
    id: 'f4',
    question: 'What is the mathematical formulation of Bayes Theorem?',
    answer: 'P(A|B) = [P(B|A) * P(A)] / P(B). Calculates posterior probability based on prior knowledge of conditions.',
    topic: 'Probability & Stats',
    difficulty: 'Medium',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    mastered: false,
  },
];

export const INITIAL_COURSES: CourseGrade[] = [
  {
    id: 'c1',
    code: 'CS401',
    name: 'Artificial Intelligence',
    currentGrade: 88,
    targetGrade: 92,
    examWeight: 30,
    color: '#4F46E5',
  },
  {
    id: 'c2',
    code: 'MATH302',
    name: 'Linear Algebra II',
    currentGrade: 84,
    targetGrade: 90,
    examWeight: 35,
    color: '#0284C7',
  },
  {
    id: 'c3',
    code: 'CS310',
    name: 'Data Structures & Algorithms',
    currentGrade: 91,
    targetGrade: 95,
    examWeight: 25,
    color: '#059669',
  },
  {
    id: 'c4',
    code: 'PHYS201',
    name: 'General Physics & Electromagnetism',
    currentGrade: 79,
    targetGrade: 85,
    examWeight: 40,
    color: '#D97706',
  },
];

export const INITIAL_SESSIONS: StudySession[] = [
  { id: 's1', course: 'CS401', durationMinutes: 50, date: '2026-08-04', type: 'pomodoro' },
  { id: 's2', course: 'MATH302', durationMinutes: 25, date: '2026-08-05', type: 'active_recall' },
  { id: 's3', course: 'CS310', durationMinutes: 75, date: '2026-08-06', type: 'pomodoro' },
  { id: 's4', course: 'PHYS201', durationMinutes: 40, date: '2026-08-07', type: 'quiz' },
  { id: 's5', course: 'CS401', durationMinutes: 60, date: '2026-08-08', type: 'pomodoro' },
  { id: 's6', course: 'MATH302', durationMinutes: 45, date: '2026-08-09', type: 'active_recall' },
  { id: 's7', course: 'CS310', durationMinutes: 90, date: '2026-08-10', type: 'pomodoro' },
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'q1',
    title: 'Backpropagation & Neural Net Fundamentals',
    course: 'CS401',
    score: 4,
    totalQuestions: 5,
    date: '2026-08-09',
    xpEarned: 120,
  },
  {
    id: 'q2',
    title: 'Eigenvalues & Diagonalization',
    course: 'MATH302',
    score: 5,
    totalQuestions: 5,
    date: '2026-08-08',
    xpEarned: 150,
  },
];


export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'CS401: Deep Neural Networks & Backpropagation Mechanics',
    course: 'CS401',
    rawText: `Lecture 8: Neural Network Gradient Optimization & Chain Rule
    
1. Supervised Learning Foundation:
Given training pairs (x_i, y_i), neural networks map input vectors x through layered weight matrices W_1, W_2, ... W_L using non-linear activation functions (ReLU, GELU, Sigmoid).

2. Loss Minimization & Objective Function:
The Cross-Entropy Loss L(y, y_hat) measures discrepancy between target probability distribution y and predicted softmax output y_hat:
L = - sum(y_i * log(y_hat_i))

3. The Backpropagation Algorithm:
Backprop applies the multivariate chain rule to calculate exact gradients of loss with respect to each parameter layer.
- Forward Pass: Compute activations a_l = sigma(z_l) where z_l = W_l * a_{l-1} + b_l.
- Backward Pass: Compute error terms delta_L = grad_z L, then propagate recursively backward:
  delta_l = (W_{l+1}^T * delta_{l+1}) * sigma'(z_l).
- Weight Update: Update weights W_l = W_l - eta * (delta_l * a_{l-1}^T) using learning rate eta.

4. Optimization Challenges:
- Vanishing Gradients: Caused by saturating activations (Sigmoid, Tanh). Solved by ReLU and Residual Connections (ResNets).
- Exploding Gradients: Mitigated by Gradient Clipping.
- Momentum & Adam Optimizer: Incorporates exponentially weighted moving averages of first and second gradient moments.`,
    summary: 'A comprehensive deep dive into Deep Neural Networks, loss function minimization via Cross-Entropy, step-by-step mathematical backpropagation chain rule derivation, and optimization stabilization techniques (Adam, ReLU, Residual Connections).',
    keyTakeaways: [
      'Forward pass calculates activations a_l = σ(W_l * a_{l-1} + b_l); backward pass calculates gradient error terms δ_l via chain rule.',
      'Cross-Entropy Loss quantifies probability divergence between target labels and softmax predicted output.',
      'Saturating activations like Sigmoid induce vanishing gradients; modern architectures mitigate this using ReLU, LayerNorm, and Residual skip connections.',
      'Adam Optimizer combines First Moment (Momentum) and Second Moment (RMSProp) gradient estimation for stable gradient updates.',
    ],
    tags: ['Machine Learning', 'Neural Networks', 'Calculus', 'Optimization'],
    createdAt: '2026-08-08T10:00:00.000Z',
    lastUpdated: '2026-08-10T14:20:00.000Z',
    generatedFlashcardsCount: 3,
    generatedQuizCount: 1,
  },
  {
    id: 'note-2',
    title: 'MATH302: Singular Value Decomposition (SVD) & Principal Component Analysis',
    course: 'MATH302',
    rawText: `Lecture 12: Matrix Factorization & Dimensionality Reduction

1. Fundamental Theorem of Linear Algebra:
Every real matrix A of dimension (m x n) can be factored into three matrices:
A = U * Sigma * V^T
- U: (m x m) orthogonal matrix containing left singular vectors (eigenvectors of A * A^T).
- Sigma: (m x n) diagonal matrix containing non-negative singular values sigma_1 >= sigma_2 >= ... >= sigma_r > 0.
- V^T: (n x n) transpose of orthogonal matrix containing right singular vectors (eigenvectors of A^T * A).

2. Connection to Eigenvalues:
The singular values sigma_i are the exact square roots of non-zero eigenvalues lambda_i of A^T * A:
sigma_i = sqrt(lambda_i).

3. Low-Rank Matrix Approximation (Eckart-Young Theorem):
Truncating SVD to top-k singular values yields matrix A_k = sum_{i=1}^k (sigma_i * u_i * v_i^T), which is the optimal rank-k approximation under Frobenius norm.

4. Principal Component Analysis (PCA):
PCA projects high-dimensional data onto orthogonal axes of maximum variance. Data covariance matrix C = (1/N) X^T X. The principal components correspond precisely to the right singular vectors V of mean-centered data matrix X.`,
    summary: 'Detailed mathematical breakdown of Singular Value Decomposition (A = UΣVᵀ), relationship between singular values and matrix eigenvalues, rank-k matrix approximation, and PCA dimensionality reduction.',
    keyTakeaways: [
      'SVD factorizes any matrix A (m x n) into orthogonal matrices U, V and non-negative diagonal matrix Σ.',
      'Singular values σ_i are square roots of eigenvalues of AᵀA (σ_i = √λ_i).',
      'Truncated SVD provides the mathematically optimal low-rank matrix approximation (Eckart-Young Theorem).',
      'PCA calculates principal axes of maximum data variance by taking eigenvectors of the mean-centered covariance matrix.',
    ],
    tags: ['Linear Algebra', 'SVD', 'PCA', 'Data Science'],
    createdAt: '2026-08-07T14:30:00.000Z',
    lastUpdated: '2026-08-09T18:10:00.000Z',
    generatedFlashcardsCount: 2,
    generatedQuizCount: 1,
  },
  {
    id: 'note-3',
    title: 'CS310: Self-Balancing Binary Search Trees (Red-Black & B-Trees)',
    course: 'CS310',
    rawText: `Lecture 15: Advanced Tree Data Structures

1. Self-Balancing BST Motivation:
Unbalanced BSTs can degenerate into O(n) linked lists when inserted with sorted data. Balanced trees maintain height h = O(log n), guaranteeing worst-case search, insertion, and deletion in O(log n).

2. Red-Black Tree Properties:
A binary search tree where each node is colored Red or Black satisfying 5 invariants:
1) Every node is either red or black.
2) The root is always black.
3) All leaf nodes (NIL) are black.
4) If a node is red, both its children must be black (no double reds!).
5) Every simple path from a node to descendant leaves contains the exact same number of black nodes (Black-Height).

3. Rebalancing Operations:
- Rotations: Left Rotation and Right Rotation change structural pointer depth in O(1) time.
- Color Recoloring: Flips parent and uncle colors when double red violations occur.

4. B-Trees for External Disk Memory:
- Multi-way search trees of order m where nodes hold up to m-1 keys and m child pointers.
- Designed to minimize expensive disk I/O operations by storing large blocks of keys per node.`,
    summary: 'Explores the 5 invariants of Red-Black Trees, structural rotation and recoloring rebalancing operations, and multi-way B-Tree storage structures optimized for disk access.',
    keyTakeaways: [
      'Red-Black Trees enforce 5 strict balance invariants ensuring height never exceeds 2 * log_2(n + 1).',
      'Left and Right tree rotations restructure pointer depth in O(1) time to maintain balance.',
      'No double red nodes are permitted (red parent must have black children).',
      'B-Trees optimize external memory disk reads by storing up to m-1 keys per page block.',
    ],
    tags: ['Data Structures', 'Algorithms', 'Trees', 'Performance'],
    createdAt: '2026-08-05T09:15:00.000Z',
    lastUpdated: '2026-08-08T11:45:00.000Z',
    generatedFlashcardsCount: 2,
    generatedQuizCount: 0,
  },
];


// Helper functions for localStorage persistence
export const loadStorageItem = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const saveStorageItem = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded or SSR
  }
};
