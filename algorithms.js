/**
 * AOA Code Library - Algorithm Data Store
 * ========================================
 * Offline-first dataset containing Analysis of Algorithms practical programs.
 * 
 * Instructions for adding/editing algorithms:
 * 1. Find the entry by its 'id' or add a new entry to the ALGORITHMS array.
 * 2. Paste your exact C source code into the 'code' property using backticks (`...`).
 * 3. Leave 'code' as an empty string ("") if code has not yet been supplied.
 * 4. Keep this file valid JavaScript; do not delete commas between objects.
 */

// Categories in display order
const CATEGORIES = [
  "Sorting and Divide and Conquer",
  "Graph Algorithms",
  "Dynamic Programming",
  "Backtracking",
  "String Matching",
  "Branch and Bound & Greedy"
];

// Global library configuration
// Set showAllAsPlaceholders to true if you wish to preview all algorithms in their empty state.
window.AOA_CONFIG = {
  showAllAsPlaceholders: false
};

const ALGORITHMS = [
  // ==========================================
  // A. Sorting and Divide and Conquer
  // ==========================================
  {
    id: "quick-sort",
    name: "Quick Sort",
    labNumber: 11,
    category: "Sorting and Divide and Conquer",
    timeComplexity: "Best: O(n log n) | Avg: O(n log n) | Worst: O(n²)",
    spaceComplexity: "O(log n) auxiliary stack space",
    inputOutput: "Input:\nEnter number of elements: 5\nEnter the elements: 35 12 89 4 23\n\nOutput:\nSorted array: 4 12 23 35 89",
    notes: "Divide and conquer algorithm using the last element as pivot. Partitions array around pivot such that smaller elements are on left and greater on right.",
    code: `#include <stdio.h> 

void quickSort(int arr[], int low, int high) 
{ 
    int pivot, temp; 
    int i, j; 
    if (low < high) 
    { 
        pivot = arr[high]; 
        i = low - 1; 
        for (j = low; j < high; j++) 
        { 
            if (arr[j] < pivot) 
            { 
                i++; 
                temp = arr[i]; 
                arr[i] = arr[j]; 
                arr[j] = temp; 
            } 
        } 
        temp = arr[i + 1]; 
        arr[i + 1] = arr[high]; 
        arr[high] = temp; 
        int position = i + 1; 
        quickSort(arr, low, position - 1); 
        quickSort(arr, position + 1, high); 
    } 
} 

int main() 
{ 
    int arr[100], n, i; 
    printf("Enter number of elements: "); 
    scanf("%d", &n); 
    printf("Enter the elements: "); 
    for (i = 0; i < n; i++) 
    { 
        scanf("%d", &arr[i]); 
    } 
    quickSort(arr, 0, n - 1); 
    printf("Sorted array: "); 
    for (i = 0; i < n; i++) 
    { 
        printf("%d ", arr[i]); 
    } 
    return 0; 
}`
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    labNumber: 2,
    category: "Sorting and Divide and Conquer",
    timeComplexity: "Best: O(n log n) | Avg: O(n log n) | Worst: O(n log n)",
    spaceComplexity: "O(n) auxiliary space for temp array",
    inputOutput: "Input:\nEnter number of elements: 6\nEnter elements: 12 11 13 5 6 7\n\nOutput:\nSorted array: 5 6 7 11 12 13",
    notes: "Divide and conquer sorting. Divides array into halves, recursively sorts them, and merges the two sorted halves into a temporary buffer.",
    code: `#include <stdio.h> 

void merge(int arr[], int low, int mid, int high) 
{ 
    int temp[100]; 
    int i = low, j = mid + 1, k = low; 
    while (i <= mid && j <= high) 
    { 
        if (arr[i] < arr[j]) 
            temp[k++] = arr[i++]; 
        else 
            temp[k++] = arr[j++]; 
    } 
    while (i <= mid) 
        temp[k++] = arr[i++]; 
    while (j <= high) 
        temp[k++] = arr[j++]; 
    for (i = low; i <= high; i++) 
        arr[i] = temp[i]; 
} 

void mergeSort(int arr[], int low, int high) 
{ 
    int mid; 
    if (low < high) 
    { 
        mid = (low + high) / 2; 
        mergeSort(arr, low, mid); 
        mergeSort(arr, mid + 1, high); 
        merge(arr, low, mid, high); 
    } 
} 

int main() 
{ 
    int arr[100], n, i; 
    printf("Enter number of elements: "); 
    scanf("%d", &n); 
    printf("Enter elements: "); 
    for (i = 0; i < n; i++) 
        scanf("%d", &arr[i]); 
    mergeSort(arr, 0, n - 1); 
    printf("Sorted array: "); 
    for (i = 0; i < n; i++) 
        printf("%d ", arr[i]); 
    return 0; 
}`
  },
  {
    id: "selection-sort",
    name: "Selection Sort",
    labNumber: 1,
    category: "Sorting and Divide and Conquer",
    timeComplexity: "Best: O(n²) | Avg: O(n²) | Worst: O(n²)",
    spaceComplexity: "O(1) in-place",
    inputOutput: "Input:\nEnter number of elements: 5\nEnter elements: 64 25 12 22 11\n\nOutput:\nSorted array: 11 12 22 25 64",
    notes: "Iteratively finds minimum element from the unsorted segment of the array and swaps it with the first unsorted element.",
    code: `#include <stdio.h> 

int main() 
{ 
    int arr[100], n, i, j, min, temp; 
    printf("Enter number of elements: "); 
    scanf("%d", &n); 
    printf("Enter elements: "); 
    for (i = 0; i < n; i++) 
        scanf("%d", &arr[i]); 
    for (i = 0; i < n - 1; i++) 
    { 
        min = i; 
        for (j = i + 1; j < n; j++) 
        { 
            if (arr[j] < arr[min]) 
                min = j; 
        } 
        temp = arr[i]; 
        arr[i] = arr[min]; 
        arr[min] = temp; 
    } 
    printf("Sorted array: "); 
    for (i = 0; i < n; i++) 
        printf("%d ", arr[i]); 
    return 0; 
}`
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    labNumber: 3,
    category: "Sorting and Divide and Conquer",
    timeComplexity: "Best: O(n) | Avg: O(n²) | Worst: O(n²)",
    spaceComplexity: "O(1) in-place",
    inputOutput: "Input:\nEnter number of elements: 5\nEnter elements: 12 11 13 5 6\n\nOutput:\nSorted array: 5 6 11 12 13",
    notes: "Builds sorted array one element at a time by shifting larger elements one position up and inserting key into correct position.",
    code: `#include <stdio.h> 

int main() 
{ 
    int arr[100], n, i, j, key; 
    printf("Enter number of elements: "); 
    scanf("%d", &n); 
    printf("Enter elements: "); 
    for (i = 0; i < n; i++) 
        scanf("%d", &arr[i]); 
    for (i = 1; i < n; i++) 
    { 
        key = arr[i]; 
        j = i - 1; 
        while (j >= 0 && arr[j] > key) 
        { 
            arr[j + 1] = arr[j]; 
            j--; 
        } 
        arr[j + 1] = key; 
    } 
    printf("Sorted array: "); 
    for (i = 0; i < n; i++) 
        printf("%d ", arr[i]); 
    return 0; 
}`
  },
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting and Divide and Conquer",
    timeComplexity: "Best: O(n) | Avg: O(n²) | Worst: O(n²)",
    spaceComplexity: "O(1) in-place",
    inputOutput: "Input:\nEnter number of elements: 5\nEnter elements: 5 1 4 2 8\n\nOutput:\nSorted array: 1 2 4 5 8",
    notes: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    code: "" // Placeholder: Supply program code when ready
  },
  {
    id: "min-max-divide-and-conquer",
    name: "Min and Max using Divide and Conquer",
    category: "Sorting and Divide and Conquer",
    timeComplexity: "O(n) - 3n/2 - 2 comparisons",
    spaceComplexity: "O(log n) recursion stack",
    inputOutput: "Input:\nEnter number of elements: 6\nEnter elements: 1000 11 445 1 330 3000\n\nOutput:\nMinimum element: 1\nMaximum element: 3000",
    notes: "Finds minimum and maximum elements in an array using divide and conquer approach, requiring fewer comparisons than linear search.",
    code: "" // Placeholder: Supply program code when ready
  },

  // ==========================================
  // B. Graph Algorithms
  // ==========================================
  {
    id: "prims-algorithm",
    name: "Prim's Algorithm",
    category: "Graph Algorithms",
    timeComplexity: "O(V²) with adjacency matrix, O(E log V) with adjacency list and min-heap",
    spaceComplexity: "O(V)",
    inputOutput: "Input:\nEnter number of vertices and adjacency matrix\n\nOutput:\nMinimum Spanning Tree edges and total cost",
    notes: "Greedy algorithm that finds a Minimum Spanning Tree for a weighted undirected graph starting from an arbitrary root vertex.",
    code: "" // Placeholder: Supply program code when ready
  },
  {
    id: "kruskals-algorithm",
    name: "Kruskal's Algorithm",
    category: "Graph Algorithms",
    timeComplexity: "O(E log E) or O(E log V)",
    spaceComplexity: "O(V + E) for Disjoint Set Union (DSU)",
    inputOutput: "Input:\nEnter number of vertices, edges, and weighted edge list\n\nOutput:\nEdges included in MST and total weight",
    notes: "Greedy algorithm that finds MST by sorting all edges by weight and adding them one by one if they don't form a cycle (using DSU).",
    code: "" // Placeholder: Supply program code when ready
  },
  {
    id: "floyd-warshall",
    name: "Floyd–Warshall Algorithm",
    labNumber: 5,
    category: "Graph Algorithms",
    timeComplexity: "O(V³)",
    spaceComplexity: "O(V²) for distance matrix",
    inputOutput: "Input:\nEnter number of vertices: 4\nEnter cost matrix (999 for no edge):\n0 3 999 7\n8 0 2 999\n5 999 0 1\n2 999 999 0\n\nOutput:\nShortest distance matrix:\n0 3 5 6\n5 0 2 3\n3 6 0 1\n2 5 7 0",
    notes: "Dynamic programming approach for All-Pairs Shortest Path problem in a directed weighted graph (handles positive and negative edge weights without negative cycles).",
    code: `#include <stdio.h> 

int main() 
{ 
    int cost[10][10], n, i, j, k; 
    printf("Enter number of vertices: "); 
    scanf("%d", &n); 
    printf("Enter cost matrix (999 for no edge):\\n"); 
    for (i = 0; i < n; i++) 
    { 
        for (j = 0; j < n; j++) 
        { 
            scanf("%d", &cost[i][j]); 
        } 
    } 
    for (k = 0; k < n; k++) 
    { 
        for (i = 0; i < n; i++) 
        { 
            for (j = 0; j < n; j++) 
            { 
                if (cost[i][k] != 999 && 
                    cost[k][j] != 999 && 
                    cost[i][j] > cost[i][k] + cost[k][j]) 
                { 
                    cost[i][j] = cost[i][k] + cost[k][j]; 
                } 
            } 
        } 
    } 
    printf("Shortest distance matrix:\\n"); 
    for (i = 0; i < n; i++) 
    { 
        for (j = 0; j < n; j++) 
            printf("%d ", cost[i][j]); 
        printf("\\n"); 
    } 
    return 0; 
}`
  },
  {
    id: "bellman-ford",
    name: "Bellman–Ford Algorithm",
    category: "Graph Algorithms",
    timeComplexity: "O(V * E)",
    spaceComplexity: "O(V)",
    inputOutput: "Input:\nEnter number of vertices, edges, edge weights, and source vertex\n\nOutput:\nShortest distances from source, or negative weight cycle detected message",
    notes: "Computes single-source shortest paths in a weighted graph. Unlike Dijkstra, Bellman-Ford can detect and handle negative edge weights.",
    code: "" // Placeholder: Supply program code when ready
  },
  {
    id: "tsp",
    name: "Travelling Salesperson Problem (TSP)",
    category: "Graph Algorithms",
    timeComplexity: "O(n² * 2ⁿ) using Dynamic Programming / O(n!) brute-force",
    spaceComplexity: "O(n * 2ⁿ)",
    inputOutput: "Input:\nEnter number of cities and distance matrix\n\nOutput:\nMinimum tour cost and visited sequence",
    notes: "Finds the shortest possible route that visits each city exactly once and returns to the origin city.",
    code: "" // Placeholder: Supply program code when ready
  },

  // ==========================================
  // C. Dynamic Programming
  // ==========================================
  {
    id: "zero-one-knapsack",
    name: "0/1 Knapsack",
    category: "Dynamic Programming",
    timeComplexity: "O(n * W) pseudo-polynomial",
    spaceComplexity: "O(n * W) or O(W)",
    inputOutput: "Input:\nEnter number of items, weights, profits, and maximum capacity W\n\nOutput:\nMaximum profit achievable without exceeding capacity",
    notes: "Each item can either be selected (1) or excluded (0). Builds a 2D table dp[i][w] representing max profit with first i items and weight limit w.",
    code: "" // Placeholder: Supply program code when ready
  },
  {
    id: "longest-common-subsequence",
    name: "Longest Common Subsequence (LCS)",
    labNumber: 6,
    category: "Dynamic Programming",
    timeComplexity: "O(m * n)",
    spaceComplexity: "O(m * n) DP table",
    inputOutput: "Input:\nEnter first string: AGGTAB\nEnter second string: GXTXAYB\n\nOutput:\nLength of LCS = 4",
    notes: "Finds the length of the longest subsequence present in both strings in the same relative order (not necessarily contiguous).",
    code: `#include <stdio.h> 
#include <string.h> 

int main() 
{ 
    char str1[100], str2[100]; 
    int dp[100][100]; 
    int m, n, i, j; 
    printf("Enter first string: "); 
    scanf("%99s", str1); 
    printf("Enter second string: "); 
    scanf("%99s", str2); 
    m = strlen(str1); 
    n = strlen(str2); 
    for (i = 0; i <= m; i++) 
        dp[i][0] = 0; 
    for (j = 0; j <= n; j++) 
        dp[0][j] = 0; 
    for (i = 1; i <= m; i++) 
    { 
        for (j = 1; j <= n; j++) 
        { 
            if (str1[i - 1] == str2[j - 1]) 
                dp[i][j] = 1 + dp[i - 1][j - 1]; 
            else if (dp[i - 1][j] > dp[i][j - 1]) 
                dp[i][j] = dp[i - 1][j]; 
            else 
                dp[i][j] = dp[i][j - 1]; 
        } 
    } 
    printf("Length of LCS = %d\\n", dp[m][n]); 
    return 0; 
}`
  },

  // ==========================================
  // D. Backtracking
  // ==========================================
  {
    id: "n-queens",
    name: "N-Queens Problem",
    labNumber: 7,
    category: "Backtracking",
    timeComplexity: "O(N!)",
    spaceComplexity: "O(N) for board array and recursion stack",
    inputOutput: "Input:\nEnter number of queens (1-20): 4\n\nOutput:\nSolution:\n. Q . .\n. . . Q\nQ . . .\n. . Q .",
    notes: "Places N non-attacking queens on an N×N chessboard using backtracking. Checks safety against rows, columns, and diagonals.",
    code: `#include <stdio.h> 
#include <stdlib.h> 

int board[20], n; 

int isSafe(int row, int col) 
{ 
    int i; 
    for (i = 0; i < row; i++) 
    { 
        if (board[i] == col || 
            abs(board[i] - col) == abs(i - row)) 
            return 0; 
    } 
    return 1; 
} 

int solve(int row) 
{ 
    int col; 
    if (row == n) 
        return 1; 
    for (col = 0; col < n; col++) 
    { 
        if (isSafe(row, col)) 
        { 
            board[row] = col; 
            if (solve(row + 1)) 
                return 1; 
        } 
    } 
    return 0; 
} 

int main() 
{ 
    int row, col; 
    printf("Enter number of queens (1-20): "); 
    scanf("%d", &n); 
    if (n < 1 || n > 20) 
    { 
        printf("Invalid board size.\\n"); 
        return 0; 
    } 
    if (solve(0)) 
    { 
        printf("Solution:\\n"); 
        for (row = 0; row < n; row++) 
        { 
            for (col = 0; col < n; col++) 
            { 
                if (board[row] == col) 
                    printf("Q "); 
                else 
                    printf(". "); 
            } 
            printf("\\n"); 
        } 
    } 
    else 
    { 
        printf("No solution exists.\\n"); 
    } 
    return 0; 
}`
  },
  {
    id: "graph-coloring",
    name: "Graph Coloring",
    category: "Backtracking",
    timeComplexity: "O(mᵛ) where m is colors, V is vertices",
    spaceComplexity: "O(V)",
    inputOutput: "Input:\nEnter vertices, adjacency matrix, and max colors m\n\nOutput:\nColor assigned to each vertex (e.g. Vertex 1 -> Color 1)",
    notes: "Assigns colors to vertices of a graph such that no two adjacent vertices share the same color, using at most m colors.",
    code: "" // Placeholder: Supply program code when ready
  },
  {
    id: "sum-of-subsets",
    name: "Sum of Subsets",
    category: "Backtracking",
    timeComplexity: "O(2ⁿ)",
    spaceComplexity: "O(n) recursion stack",
    inputOutput: "Input:\nEnter set elements and target sum\n\nOutput:\nSubsets whose elements add up exactly to target sum",
    notes: "Finds all subsets of positive integers whose sum equals a given target sum S, using state space tree pruning.",
    code: "" // Placeholder: Supply program code when ready
  },

  // ==========================================
  // E. String Matching
  // ==========================================
  {
    id: "naive-string-matching",
    name: "Naive String Matching",
    labNumber: 9,
    category: "String Matching",
    timeComplexity: "Best: O(n) | Worst: O((n - m + 1) * m)",
    spaceComplexity: "O(1)",
    inputOutput: "Input:\nEnter text: AABAACAADAABAABA\nEnter pattern: AABA\n\nOutput:\nPattern found at index 0\nPattern found at index 9\nPattern found at index 12",
    notes: "Slides pattern over text one by one and checks for match at each position. Straightforward brute force approach.",
    code: `#include <stdio.h> 
#include <string.h> 

int main() 
{ 
    char text[200], pattern[100]; 
    int n, m, i, j, found = 0; 
    printf("Enter text: "); 
    scanf("%199s", text); 
    printf("Enter pattern: "); 
    scanf("%99s", pattern); 
    n = strlen(text); 
    m = strlen(pattern); 
    for (i = 0; i <= n - m; i++) 
    { 
        for (j = 0; j < m; j++) 
        { 
            if (text[i + j] != pattern[j]) 
                break; 
        } 
        if (j == m) 
        { 
            printf("Pattern found at index %d\\n", i); 
            found = 1; 
        } 
    } 
    if (!found) 
        printf("Pattern not found.\\n"); 
    return 0; 
}`
  },
  {
    id: "rabin-karp",
    name: "Rabin–Karp",
    labNumber: 10,
    category: "String Matching",
    timeComplexity: "Best/Avg: O(n + m) | Worst: O(n * m)",
    spaceComplexity: "O(1)",
    inputOutput: "Input:\nEnter text: GEKSEFORGELKS\nEnter pattern: GEK\n\nOutput:\nPattern found at index 0",
    notes: "Uses rolling hash function (with modulo PRIME) to quickly filter out positions that cannot match the pattern before verifying characters.",
    code: `#include <stdio.h> 
#include <string.h> 

#define PRIME 101 

int main() 
{ 
    char text[200], pattern[100]; 
    int n, m, i, j; 
    int textHash = 0, patternHash = 0; 
    int power = 1, found = 0; 
    printf("Enter text: "); 
    scanf("%199s", text); 
    printf("Enter pattern: "); 
    scanf("%99s", pattern); 
    n = strlen(text); 
    m = strlen(pattern); 
    if (m > n) 
    { 
        printf("Pattern not found.\\n"); 
        return 0; 
    } 
    for (i = 0; i < m - 1; i++) 
        power = (power * 256) % PRIME; 
    for (i = 0; i < m; i++) 
    { 
        patternHash = (256 * patternHash + pattern[i]) % PRIME; 
        textHash = (256 * textHash + text[i]) % PRIME; 
    } 
    for (i = 0; i <= n - m; i++) 
    { 
        if (patternHash == textHash) 
        { 
            for (j = 0; j < m; j++) 
            { 
                if (text[i + j] != pattern[j]) 
                    break; 
            } 
            if (j == m) 
            { 
                printf("Pattern found at index %d\\n", i); 
                found = 1; 
            } 
        } 
        if (i < n - m) 
        { 
            textHash = 
                (256 * (textHash - text[i] * power) 
                 + text[i + m]) % PRIME; 
            if (textHash < 0) 
                textHash += PRIME; 
        } 
    } 
    if (!found) 
        printf("Pattern not found.\\n"); 
    return 0; 
}`
  },
  {
    id: "finite-automata",
    name: "Finite Automata String Matching",
    category: "String Matching",
    timeComplexity: "Preprocessing: O(m * |Σ|) | Matching: O(n)",
    spaceComplexity: "O(m * |Σ|) for transition table",
    inputOutput: "Input:\nEnter text and pattern\n\nOutput:\nOccurrences of pattern at text indices",
    notes: "Constructs a Deterministic Finite Automaton (DFA) representing the pattern; scans text in linear O(n) time with zero backtracking.",
    code: "" // Placeholder: Supply program code when ready
  },
  {
    id: "boyer-moore",
    name: "Boyer–Moore",
    category: "String Matching",
    timeComplexity: "Best: O(n / m) sub-linear | Worst: O(n * m)",
    spaceComplexity: "O(|Σ|) for Bad Character heuristic",
    inputOutput: "Input:\nEnter text and pattern\n\nOutput:\nIndex where pattern begins",
    notes: "Scans characters of pattern from right to left and uses the Bad Character and Good Suffix heuristics to make large shifts over the text.",
    code: "" // Placeholder: Supply program code when ready
  },
  {
    id: "kmp",
    name: "Knuth–Morris–Pratt (KMP)",
    category: "String Matching",
    timeComplexity: "O(n + m) linear",
    spaceComplexity: "O(m) for π / LPS (Longest Proper Prefix which is Suffix) array",
    inputOutput: "Input:\nEnter text and pattern\n\nOutput:\nIndex positions of pattern occurrences",
    notes: "Uses preprocessing on pattern to build π / LPS table to skip redundant character comparisons when a mismatch occurs.",
    code: "" // Placeholder: Supply program code when ready
  },

  // ==========================================
  // F. Additional Practicals (Branch and Bound & Greedy)
  // ==========================================
  {
    id: "fractional-knapsack",
    name: "Fractional Knapsack",
    labNumber: 4,
    category: "Branch and Bound & Greedy",
    timeComplexity: "O(n log n) or O(n²) sorting",
    spaceComplexity: "O(n)",
    inputOutput: "Input:\nEnter number of items: 3\nEnter weight and profit of item 1: 10 60\nEnter weight and profit of item 2: 20 100\nEnter weight and profit of item 3: 30 120\nEnter knapsack capacity: 50\n\nOutput:\nMaximum profit = 240.00",
    notes: "Greedy algorithm: sorts items by profit-to-weight ratio (P/W) in descending order and greedily takes full or fractional amounts of items.",
    code: `#include <stdio.h> 

int main() 
{ 
    int n, i, j; 
    float weight[100], profit[100], ratio[100]; 
    float capacity, totalProfit = 0, temp; 
    printf("Enter number of items: "); 
    scanf("%d", &n); 
    for (i = 0; i < n; i++) 
    { 
        printf("Enter weight and profit of item %d: ", i + 1); 
        scanf("%f %f", &weight[i], &profit[i]); 
        ratio[i] = profit[i] / weight[i]; 
    } 
    printf("Enter knapsack capacity: "); 
    scanf("%f", &capacity); 
    for (i = 0; i < n - 1; i++) 
    { 
        for (j = i + 1; j < n; j++) 
        { 
            if (ratio[i] < ratio[j]) 
            { 
                temp = ratio[i]; 
                ratio[i] = ratio[j]; 
                ratio[j] = temp; 
                temp = weight[i]; 
                weight[i] = weight[j]; 
                weight[j] = temp; 
                temp = profit[i]; 
                profit[i] = profit[j]; 
                profit[j] = temp; 
            } 
        } 
    } 
    for (i = 0; i < n; i++) 
    { 
        if (capacity >= weight[i]) 
        { 
            capacity -= weight[i]; 
            totalProfit += profit[i]; 
        } 
        else 
        { 
            totalProfit += ratio[i] * capacity; 
            break; 
        } 
    } 
    printf("Maximum profit = %.2f\\n", totalProfit); 
    return 0; 
}`
  },
  {
    id: "fifteen-puzzle",
    name: "15-Puzzle Problem",
    labNumber: 8,
    category: "Branch and Bound & Greedy",
    timeComplexity: "Exponential worst case, guided by Manhattan distance heuristic",
    spaceComplexity: "O(MAX) state nodes in min-heap priority queue",
    inputOutput: "Input:\nEnter puzzle (use 0 for blank):\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 0 15\n\nOutput:\nSolution in 1 moves:\n 1  2  3  4 \n 5  6  7  8 \n 9 10 11 12 \n13 14 15  0",
    notes: "Branch and Bound search using A* algorithm with Manhattan distance heuristic (h) + path cost (g) on a min-heap priority queue.",
    code: `#include <stdio.h> 
#include <stdlib.h> 

#define MAX 50000 

typedef struct 
{ 
    int board[16]; 
    int blank; 
    int g, h, parent; 
} Node; 

Node nodes[MAX]; 
int heap[MAX], count = 0, total = 0; 

int distance(int board[]) 
{ 
    int i, value, goalRow, goalCol, row, col, h = 0; 
    for (i = 0; i < 16; i++) 
    { 
        value = board[i]; 
        if (value != 0) 
        { 
            goalRow = (value - 1) / 4; 
            goalCol = (value - 1) % 4; 
            row = i / 4; 
            col = i % 4; 
            h += abs(row - goalRow) + abs(col - goalCol); 
        } 
    } 
    return h; 
} 

int priority(int index) 
{ 
    return nodes[index].g + nodes[index].h; 
} 

void push(int index) 
{ 
    int i = count++; 
    heap[i] = index; 
    while (i > 0) 
    { 
        int p = (i - 1) / 2; 
        if (priority(heap[p]) <= priority(heap[i])) 
            break; 
        int temp = heap[p]; 
        heap[p] = heap[i]; 
        heap[i] = temp; 
        i = p; 
    } 
} 

int pop() 
{ 
    int result = heap[0]; 
    heap[0] = heap[--count]; 
    int i = 0; 
    while (1) 
    { 
        int left = 2 * i + 1; 
        int right = 2 * i + 2; 
        int smallest = i; 
        if (left < count && 
            priority(heap[left]) < priority(heap[smallest])) 
            smallest = left; 
        if (right < count && 
            priority(heap[right]) < priority(heap[smallest])) 
            smallest = right; 
        if (smallest == i) 
            break; 
        int temp = heap[i]; 
        heap[i] = heap[smallest]; 
        heap[smallest] = temp; 
        i = smallest; 
    } 
    return result; 
} 

int sameBoard(int a[], int b[]) 
{ 
    int i; 
    for (i = 0; i < 16; i++) 
        if (a[i] != b[i]) 
            return 0; 
    return 1; 
} 

int main() 
{ 
    int start[16], i, j, blank = 0; 
    int goal[16]; 
    for (i = 0; i < 16; i++) 
        goal[i] = (i + 1) % 16; 
    printf("Enter puzzle (use 0 for blank):\\n"); 
    for (i = 0; i < 16; i++) 
    { 
        scanf("%d", &start[i]); 
        if (start[i] == 0) 
            blank = i; 
    } 
    nodes[0].blank = blank; 
    nodes[0].g = 0; 
    nodes[0].h = distance(start); 
    nodes[0].parent = -1; 
    for (i = 0; i < 16; i++) 
        nodes[0].board[i] = start[i]; 
    total = 1; 
    push(0); 
    while (count > 0 && total < MAX) 
    { 
        int current = pop(); 
        if (nodes[current].h == 0) 
        { 
            int path[MAX], length = 0, p = current; 
            while (p != -1) 
            { 
                path[length++] = p; 
                p = nodes[p].parent; 
            } 
            printf("Solution in %d moves:\\n", nodes[current].g); 
            for (i = length - 1; i >= 0; i--) 
            { 
                for (j = 0; j < 16; j++) 
                { 
                    printf("%2d ", nodes[path[i]].board[j]); 
                    if (j % 4 == 3) 
                        printf("\\n"); 
                } 
                printf("\\n"); 
            } 
            return 0; 
        } 
        int moves[] = {-4, 4, -1, 1}; 
        for (i = 0; i < 4; i++) 
        { 
            int newBlank = nodes[current].blank + moves[i]; 
            if (newBlank < 0 || newBlank >= 16) 
                continue; 
            if (i == 2 && nodes[current].blank % 4 == 0) 
                continue; 
            if (i == 3 && nodes[current].blank % 4 == 3) 
                continue; 
            Node next = nodes[current]; 
            next.board[next.blank] = next.board[newBlank]; 
            next.board[newBlank] = 0; 
            next.blank = newBlank; 
            next.g++; 
            next.h = distance(next.board); 
            next.parent = current; 
            /* Avoid returning to the parent board */ 
            if (nodes[current].parent != -1 && 
                sameBoard(next.board, 
                          nodes[nodes[current].parent].board)) 
                continue; 
            if (total < MAX) 
            { 
                nodes[total] = next; 
                push(total); 
                total++; 
            } 
        } 
    } 
    printf("No solution found within the memory limit.\\n"); 
    return 0; 
}`
  }
];

// Ensure global accessibility in all browser environments
if (typeof window !== 'undefined') {
  window.CATEGORIES = CATEGORIES;
  window.ALGORITHMS = ALGORITHMS;
}
