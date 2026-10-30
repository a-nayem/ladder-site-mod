/* Curriculum data. Edit this file to change topics, projects, weeks or extras.
   Project text starts with a tag: [220] [250] [320] course, [all] all courses, [skill] skill only.
   Task ids are built from the language, topic number and tier, so keep the numbers stable once you start ticking. */
export const DATA: any = {
  startDefault: "2026-10-20",
  dailyTargets: {
    early: { py: 2, cpp: 2, java: 1 },
    late: { py: 2.5, cpp: 1.5, java: 1 }
  },

  weeks: [
    { w: 1, py: [1, 3], cpp: [1, 3], java: [1, 2], payoff: "CSE250 weeks 1 and 2, CSE320 weeks 3, 4 and 11, CSE220 weeks 1 to 4" },
    { w: 2, py: [4, 6], cpp: [4, 6], java: [3, 3], payoff: "CSE220 weeks 5 to 8, CSE320 weeks 1 and 2, CSE250 weeks 2 and 3" },
    { w: 3, py: [7, 9], cpp: [7, 9], java: [4, 5], payoff: "CSE320 week 5, CSE250 weeks 2 and 3, CSE220 weeks 7 and 8" },
    { w: 4, py: [10, 12], cpp: [10, 12], java: [6, 7], payoff: "CSE220 weeks 9 and 10, CSE250 weeks 4, 9 and 10, CSE320 weeks 2, 4 and 8" },
    { w: 5, py: [13, 15], cpp: [13, 14], java: [8, 8], payoff: "CSE220 lab 11, CSE250 weeks 3 and 4, CSE320 week 1" },
    { w: 6, py: [16, 18], cpp: [15, 16], java: [9, 10], payoff: "CSE250 weeks 4 to 10, CSE320 weeks 7 to 10" },
    { w: 7, py: [19, 21], cpp: [17, 18], java: [11, 12], payoff: "CSE320 weeks 7 and 10, CSE250 week 8" },
    { w: 8, py: [22, 23], cpp: [19, 20], java: [13, 13], payoff: "Revision, using your tools as problem checkers" }
  ],

  gates: [
    { id: "P1", lang: "py", week: 3, uses: "Python 1 to 8", text: "[250] Netlist toolkit CLI: parse a netlist file, reduce series and parallel parts, report line numbered errors, with tests" },
    { id: "C1", lang: "cpp", week: 3, uses: "C++ 1 to 7", text: "[320] Frame tool: build frames with parity and a checksum, save them to a file, leak free under ASan" },
    { id: "J1", lang: "java", week: 4, uses: "Java 1 to 7", text: "[220] Data structure library: circular array, linked list, stack, queue, hash map, BST and heap, with JUnit and a complexity table" },
    { id: "P2", lang: "py", week: 5, uses: "Python 1 to 15", text: "[320] Datacom toolkit: coding, framing, Hamming, checksum and a noisy channel, typed and tested" },
    { id: "C2", lang: "cpp", week: 5, uses: "C++ 1 to 14", text: "[250] Circuit solver: matrix, phasors and nodal solver built with CMake and tested under sanitizers" },
    { id: "J2", lang: "java", week: 6, uses: "Java 1 to 10", text: "[320] Topology simulator: graph, shortest routes and concurrent link failures, with a JMH benchmark" },
    { id: "P3", lang: "py", week: 7, uses: "Python 1 to 19", text: "[250] Circuit solver service: async job queue, nodal solver and FastAPI endpoints with tests" }
  ],

  capstones: [
    { id: "py", lang: "py", week: 8, text: "[all] Python: FastAPI service with the RAG study assistant over your own CSE220, CSE250 and CSE320 notes" },
    { id: "cpp", lang: "cpp", week: 8, text: "[skill] C++: similarity search module bound into the Python service" },
    { id: "java", lang: "java", week: 8, text: "[all] Java: Spring gateway with auth, rate limiting and caching in front of the Python service" }
  ],

  ladders: {
    py: [
      { n: 1, title: "Variables, types and operators", lesson: "int, float, str, bool, None, conversion, f strings, input and print", p: [
        "[250] Ohm's law and power calculator that solves for any one unknown",
        "[250] Series and parallel resistor network calculator with input validation",
        "[320] Data rate calculator using Nyquist and Shannon limits and dB conversions, with a spec and an edge case table"] },
      { n: 2, title: "Conditionals and loops", lesson: "if, elif, match, for, while, range, break, continue", p: [
        "[320] Parity bit generator and checker for bit strings",
        "[320] 16 bit checksum calculator that detects a corrupted message",
        "[320] Hamming code encoder and decoder with single error correction and a syndrome table"] },
      { n: 3, title: "Strings", lesson: "slicing, methods, formatting, unicode and encoding", p: [
        "[320] Binary, hex and decimal converter with padding",
        "[320] Line coding encoder and decoder: NRZ, Manchester and differential Manchester",
        "[320] Frame builder and parser with byte stuffing and bit stuffing, escape handling and clear errors"] },
      { n: 4, title: "Lists and tuples", lesson: "indexing, slicing, sorting, mutability, unpacking, copying", p: [
        "[220] Stack and queue on Python lists, with a parentheses checker",
        "[220] Circular array queue with wraparound, full and empty checks",
        "[220] Sorting toolkit (insertion, merge, quick) with a benchmark and a complexity table"] },
      { n: 5, title: "Dicts and sets", lesson: "hashing, counting, grouping, set operations", p: [
        "[320] Port and protocol lookup tagged by layer",
        "[320] Topology analyzer: link counts and failure impact for star, bus, ring and mesh",
        "[250] Netlist parser that turns lines like `R1 n1 n2 1k` into components and a node set, with validation errors"] },
      { n: 6, title: "Functions", lesson: "args, kwargs, defaults, scope, closures, recursion, docstrings", p: [
        "[250] Series, parallel and divider functions",
        "[220] Recursion toolkit: memoized Fibonacci, Tower of Hanoi, permutations",
        "[250] Recursive reducer for nested series and parallel expressions such as `S(R1, P(R2, R3))`"] },
      { n: 7, title: "Comprehensions and lambdas", lesson: "list, dict and set comprehensions, map, filter, sort keys", p: [
        "[320] Quantize a list of samples into levels",
        "[320] PCM and delta modulation encoders and decoders with a quantization error comparison",
        "[250] Chainable netlist query builder: filter by type, sort by value, group by node"] },
      { n: 8, title: "Errors and files", lesson: "try, except, finally, custom exceptions, open, json, csv, pathlib", p: [
        "[250] Lab measurement logger saved to CSV and reloaded",
        "[250] Netlist file loader with line numbered errors and custom exceptions",
        "[320] Packet log analyzer for large CSV logs: malformed row report, per protocol stats, atomic output write, exit codes"] },
      { n: 9, title: "Modules and packages", lesson: "imports, __name__, package layout, pip, pyproject.toml, venv", p: [
        "[220] Split stack, queue and sorting code into a package",
        "[320] Installable `datacom` package with parity, checksum, Hamming and framing",
        "[250] Circuit toolkit CLI whose analyzers (divider, power, reducer) are plugins found with `importlib`"] },
      { n: 10, title: "Classes and objects", lesson: "attributes, methods, __init__, encapsulation, class versus instance data", p: [
        "[220] Singly linked list class with insert, delete and search",
        "[220] Dummy headed circular doubly linked list with a shared test suite",
        "[250] Circuit model with Resistor and source classes, a Circuit class that rejects floating nodes and shorted sources, and a class diagram"] },
      { n: 11, title: "Inheritance and dunders", lesson: "super, ABCs, dataclasses, __repr__, __eq__, __lt__, operators", p: [
        "[250] Component hierarchy with the impedance of Resistor, Capacitor and Inductor at a frequency",
        "[250] Phasor class with polar and rectangular forms and operator dunders",
        "[320] Protocol stack simulator: layers add headers going down and strip them going up across a small topology"] },
      { n: 12, title: "Iterators and generators", lesson: "iterator protocol, yield, itertools, lazy pipelines", p: [
        "[320] TDM multiplexer and demultiplexer built with generators",
        "[320] Noisy channel generator with a bit error rate and burst errors, used to test your Hamming and checksum code",
        "[220] BST with lazy iterators for four traversals, stress tested against `sorted()`"] },
      { n: 13, title: "Decorators and context managers", lesson: "closures, functools.wraps, contextlib", p: [
        "[220] Timing decorator used to benchmark your sorts",
        "[skill] Parameterized retry and cache decorators",
        "[skill] Rate limiter and circuit breaker decorators with thread safe state"] },
      { n: 14, title: "Typing and testing", lesson: "type hints, generics, mypy, ruff, pytest fixtures, parametrize, mocks", p: [
        "[220] Add types and tests to the stack, queue and list code",
        "[250] `pytest` suite that checks the circuit model against textbook worked examples",
        "[320] Hypothesis tests proving Hamming fixes every single bit error and the checksum catches every single bit flip, plus a CI script"] },
      { n: 15, title: "SQL with sqlite3", lesson: "SELECT, JOIN, indexes, transactions, parameterized queries", p: [
        "[250] Store lab measurements in SQLite",
        "[320] Packet log database with per protocol and top sender queries",
        "[skill] Repository layer with transactions and index tuning from `EXPLAIN`, benchmarked at 1 million rows"] },
      { n: 16, title: "NumPy", lesson: "arrays, broadcasting, vectorization, linear algebra", p: [
        "[250] Nodal analysis of a 3 node resistor circuit with `numpy.linalg.solve`",
        "[250] General nodal solver that builds its matrix from a netlist and handles supernodes, checked against LTSpice",
        "[250] Mesh and nodal solver with dependent sources, source transformation, a superposition check, and a Thevenin and Norton equivalent finder with a maximum power transfer sweep, tested on 10 circuits"] },
      { n: 17, title: "pandas and matplotlib", lesson: "DataFrame, groupby, merge, cleaning, plotting", p: [
        "[250] RC and RL step response curves plotted from the closed form",
        "[250] AC analysis of series and parallel RLC: magnitude and phase plots, RMS values, instantaneous power and superposition of sources at different frequencies",
        "[320] Modulation lab: ASK, FSK and PSK waves with noise, FFT bandwidth measurement, a DSSS and FHSS spreading experiment and a findings write up"] },
      { n: 18, title: "HTTP and FastAPI", lesson: "REST, routing, pydantic, JWT auth, OpenAPI", p: [
        "[250] Equivalent resistance REST API in memory",
        "[250] Circuit solver API: POST a netlist, get node voltages, with validation and JWT auth",
        "[250] Layered solver service with a job queue, pagination, rate limiting, tests and a Dockerfile"] },
      { n: 19, title: "Async and concurrency", lesson: "threads, asyncio, the GIL, multiprocessing", p: [
        "[320] Async TCP echo server and client",
        "[320] Multi client chat server on `asyncio` using your frame format",
        "[320] Multiple access simulator for pure ALOHA, slotted ALOHA and CSMA, with Monte Carlo trials run in parallel with `multiprocessing` and throughput plotted against theory"] },
      { n: 20, title: "PyTorch basics", lesson: "tensors, autograd, devices", p: [
        "[skill] Tensor drills and a manual gradient check",
        "[250] Fit R and C from noisy transient data with autograd gradient descent",
        "[skill] Micrograd style autograd engine from scratch, gradient checked against PyTorch"] },
      { n: 21, title: "Training neural nets", lesson: "nn.Module, optimizers, losses, batching, overfitting, evaluation", p: [
        "[skill] MLP on a small tabular dataset",
        "[320] Neural symbol detector for noisy BPSK compared with a threshold detector",
        "[skill] Training framework with configs, checkpoints, metric logging and fixed seeds"] },
      { n: 22, title: "Tokenization and attention", lesson: "character and BPE tokens, self attention, transformer blocks", p: [
        "[skill] Character tokenizer and a bigram model",
        "[skill] BPE tokenizer from scratch",
        "[skill] Small GPT trained on a text corpus with attention written by hand"] },
      { n: 23, title: "Embeddings and RAG", lesson: "vectors, similarity, chunking, retrieval, evaluation", p: [
        "[skill] Semantic search over a list of sentences",
        "[all] RAG pipeline over your own CSE220, CSE250 and CSE320 notes",
        "[all] Study assistant RAG service with an eval set built from your own practice questions, recall at k, caching and a FastAPI endpoint"] }
    ],

    cpp: [
      { n: 1, title: "Toolchain, variables and types", lesson: "g++, compile stages, headers, fixed width ints, auto, const, cin and cout, undefined behavior", p: [
        "[250] Ohm's law and power calculator",
        "[320] Data rate and dB calculator with Nyquist and Shannon limits, input validation and overflow checks",
        "[320] Bit manipulation library: set, clear, toggle, count and extract fields on fixed width ints, with undefined behavior guards and a spec table"] },
      { n: 2, title: "Operators, conditionals and loops", lesson: "if, switch, for, while, range for", p: [
        "[320] Parity bit generator and checker",
        "[320] 16 bit checksum calculator with verification",
        "[320] CRC generator and checker using bitwise polynomial division, tested against textbook examples"] },
      { n: 3, title: "Functions", lesson: "pass by value and reference, default args, overloading, constexpr, recursion", p: [
        "[250] Series, parallel and divider functions",
        "[220] Recursion toolkit: Fibonacci, Tower of Hanoi, permutations",
        "[250] Recursive descent parser for series parallel network expressions with an equivalent resistance evaluator"] },
      { n: 4, title: "Arrays, vector and string", lesson: "C arrays, std::array, std::vector, std::string, string_view", p: [
        "[220] Parentheses checker with an array based stack",
        "[220] Circular array queue with wraparound, full and empty checks and resizing",
        "[220] Sorting and searching toolkit (insertion, merge, quick, binary search) benchmarked against `std::sort`, with a complexity table"] },
      { n: 5, title: "References and pointers", lesson: "pointer arithmetic, const correctness, nullptr, dangling pointers", p: [
        "[220] In place swap, reverse and rotate on arrays using pointers",
        "[220] Singly linked list with raw pointers and a leak check",
        "[220] Dummy headed circular doubly linked list, clean under ASan"] },
      { n: 6, title: "Dynamic memory", lesson: "stack versus heap, new, delete, leaks, valgrind", p: [
        "[220] Dynamic array that grows",
        "[220] Linked list stack and queue with manual memory, checked by valgrind",
        "[220] Hash table with chaining and resizing on manual memory, tested against `std::unordered_map`"] },
      { n: 7, title: "Structs and classes", lesson: "members, access control, static, const methods, enums", p: [
        "[250] Component struct with value and tolerance and a total power function",
        "[250] Circuit class with nodes and components, and validation",
        "[320] Packet and frame structs with byte serialization, header fields and endianness handling"] },
      { n: 8, title: "CMake, tests and sanitizers", lesson: "targets, GoogleTest or Catch2, ASan, UBSan, clang-tidy", p: [
        "[320] CMake project for your bit tools with one test",
        "[220] Retrofit the stack, queue and list projects with CMake and GoogleTest",
        "[skill] Multi target project with a script that runs tests under sanitizers and clang-tidy"] },
      { n: 9, title: "RAII", lesson: "constructors, initializer lists, destructors, scope guards, object lifetime", p: [
        "[skill] File handle wrapper that closes itself",
        "[skill] Scope guard and timer utility classes",
        "[320] Socket wrapper with exception safe acquisition and tests that inject failures"] },
      { n: 10, title: "Smart pointers", lesson: "unique_ptr, shared_ptr, weak_ptr, ownership rules", p: [
        "[220] Refactor the linked list to `unique_ptr`",
        "[220] Binary tree with `unique_ptr` children and four traversals",
        "[220] BST with deletion and weak parent links, no leaks, tested against `std::set`"] },
      { n: 11, title: "Operator overloading and the rule of five", lesson: "copy, move, assignment, ==, <<, []", p: [
        "[250] Complex number class with arithmetic",
        "[250] Phasor class with polar and rectangular forms and the impedance of R, L and C",
        "[250] Matrix class with correct copy semantics and a Gaussian elimination solver for nodal equations, checked against your Python solver"] },
      { n: 12, title: "Inheritance and polymorphism", lesson: "virtual, abstract classes, override, final, slicing", p: [
        "[250] Component hierarchy with a virtual impedance method",
        "[320] Line coding encoders behind one interface: NRZ, Manchester, differential Manchester",
        "[320] Protocol layer stack with polymorphic layers for encapsulation and decapsulation"] },
      { n: 13, title: "Templates", lesson: "function and class templates, specialization, concepts", p: [
        "[skill] Generic max, min and swap",
        "[220] Generic stack and queue templates",
        "[220] Generic BST template with a custom comparator"] },
      { n: 14, title: "STL containers and iterators", lesson: "vector, list, map, unordered_map, set, deque, iterator categories", p: [
        "[320] Topology adjacency map for star, ring, bus and mesh",
        "[220] Graph with BFS and DFS using a vector and a queue",
        "[220] Binary heap and priority queue from scratch, checked against `std::priority_queue`"] },
      { n: 15, title: "STL algorithms and lambdas", lesson: "sort, find, transform, accumulate, ranges, captures", p: [
        "[skill] Rewrite earlier loops with algorithms",
        "[250] Netlist query tool with filter, group and sort via lambdas",
        "[skill] Mini LINQ style pipeline with ranges"] },
      { n: 16, title: "Streams, files and errors", lesson: "fstream, exceptions, optional, noexcept, error handling styles", p: [
        "[250] Lab measurement logger to a file",
        "[250] Netlist parser with line numbered errors",
        "[320] Packet log processor that streams large files, with an error taxonomy and exit codes"] },
      { n: 17, title: "Move semantics", lesson: "rvalue references, std::move, perfect forwarding, copy elision", p: [
        "[skill] Instrument a class to count copies and moves",
        "[skill] Move enabled string and vector classes",
        "[320] Packet buffer type that moves instead of copies, benchmarked against a copying version"] },
      { n: 18, title: "Threads, mutexes and atomics", lesson: "std::thread, mutex, condition_variable, atomic, data races, TSan", p: [
        "[skill] Parallel sum with threads",
        "[320] Polling and token ring simulator with station threads",
        "[320] Thread pool with futures that runs Monte Carlo trials of an access protocol simulator, clean under TSan"] },
      { n: 19, title: "Performance", lesson: "cache behavior, profiling with perf, optimization flags, SIMD intro", p: [
        "[skill] Row versus column traversal benchmark",
        "[250] Matrix multiply naive, blocked and threaded, tuned for nodal solver matrices",
        "[skill] Vector similarity search with top k, optimized, with a benchmark report"] },
      { n: 20, title: "Python interop with pybind11", lesson: "pybind11, NumPy buffers, building a wheel", p: [
        "[skill] Expose one C++ function to Python",
        "[250] Expose your C++ nodal solver to Python and call it from the FastAPI solver service",
        "[skill] Installable similarity search extension benchmarked against NumPy"] }
    ],

    java: [
      { n: 1, title: "Arrays and circular arrays", lesson: "linear array operations, circular indexing with modulo, wraparound, resizing", p: [
        "[220] Array utility class: insert, remove, shift and rotate in a linear array",
        "[220] Circular array with wraparound, resizing and a ring buffer use case",
        "[220] Generic circular buffer library with an iterator and JUnit tests for full, empty and overflow cases"] },
      { n: 2, title: "Linked lists", lesson: "singly, doubly and circular lists, dummy head, insert, remove, search, reverse", p: [
        "[220] Singly linked list with insert, remove and search",
        "[220] Dummy headed circular doubly linked list, matching the lab",
        "[220] Linked list library with an iterator, reverse, sorted merge and cycle detection, all tested"] },
      { n: 3, title: "Stacks and queues", lesson: "stack and queue on arrays and lists, circular array queue, parentheses checking, postfix", p: [
        "[220] Parentheses checker using a stack built on a list",
        "[220] Queue on a circular array applied to a print spooler simulation",
        "[220] Infix to postfix converter and evaluator using stacks, with error reporting"] },
      { n: 4, title: "Recursion, sorting and searching", lesson: "recursion and backtracking, binary search, bubble, insertion, merge and quick sort, complexity", p: [
        "[220] Recursion toolkit: factorial, Fibonacci, Tower of Hanoi, binary search",
        "[220] Sorting suite (bubble, insertion, merge, quick) with a comparison counter and a benchmark",
        "[220] N Queens and permutation generators with backtracking, plus a complexity write up comparing recursive and iterative versions"] },
      { n: 5, title: "Hashing", lesson: "hash functions, collisions, chaining, open addressing, resizing, key indexing", p: [
        "[220] Hash set with chaining",
        "[220] Hash map with resizing and key indexing",
        "[220] Open addressing map with load factor tuning, benchmarked against `java.util.HashMap`"] },
      { n: 6, title: "Trees and BST", lesson: "traversals, insert, delete, height, level order, balance, rotations", p: [
        "[220] BST with insert, search and traversals",
        "[220] BST with delete, height, level order and an iterator",
        "[220] AVL tree with rotations and tests of the balance invariant"] },
      { n: 7, title: "Heaps and priority queues", lesson: "sift up, sift down, heapify, heap sort, top k", p: [
        "[220] Min heap on an array",
        "[220] Task scheduler ordered by priority",
        "[220] Heap sort and a top k stream tool, with a complexity table"] },
      { n: 8, title: "Graphs and shortest paths", lesson: "adjacency lists, BFS, DFS, components, topological sort, Dijkstra, A star", p: [
        "[220] Graph with BFS and DFS",
        "[320] Network topology analyzer: shortest hop route and failure impact on star, ring and mesh",
        "[250] Circuit graph analyzer: nodes, branches and independent loops of a netlist, giving the number of KCL and KVL equations, cross checked with your Python solver"] },
      { n: 9, title: "Generics, collections and streams", lesson: "bounded types, wildcards, collections internals, lambdas, streams, records, Optional", p: [
        "[220] Generic Pair and Box",
        "[220] Generic linked list and stack with bounded wildcards, reusing your earlier code",
        "[320] Packet log analytics with `groupingBy`, a custom collector and a parallel stream benchmark"] },
      { n: 10, title: "Threads, executors and sockets", lesson: "synchronized, volatile, locks, ExecutorService, memory model, CompletableFuture, TCP sockets", p: [
        "[320] TCP echo server and client",
        "[320] Multi client chat server with an executor and framed messages",
        "[320] Shared channel simulator for slotted ALOHA and CSMA with station threads, collision statistics and a stress test"] },
      { n: 11, title: "JVM internals and profiling", lesson: "heap layout, garbage collectors, JIT, profiling, JMH", p: [
        "[skill] Read GC logs of an allocation heavy program",
        "[skill] Find and fix a memory leak from a heap dump",
        "[skill] JMH suite comparing data structures and GC settings, with written conclusions"] },
      { n: 12, title: "Spring Boot REST, persistence and security", lesson: "controllers, DTOs, validation, exception handling, MockMvc, JPA, relations, Flyway, JWT, roles", p: [
        "[250] Circuit calculator REST API in memory",
        "[250] Circuit solver API that calls your Python solver, with validation and tests",
        "[skill] Layered service with JPA persistence, JWT auth with roles, migrations and integration tests"] },
      { n: 13, title: "Resilience, observability and the gateway", lesson: "caching, retries, timeouts, circuit breakers, metrics, tracing", p: [
        "[skill] Cache one endpoint",
        "[skill] Retry, timeout and circuit breaker around a call to your Python service",
        "[all] Gateway with rate limiting, metrics and tracing in front of the Python study assistant service"] }
    ]
  },

  courses: [
    {
      id: "220", name: "CSE220 Data Structures", note: "Java is the lab language with a 3 hour lab each week.",
      url: "https://cse.bracu.ac.bd/course/view/CSE220",
      rows: [
        ["1", "Arrays and circular arrays", ["J1", "Py 4 I", "C 4 I"]],
        ["2 to 4", "Linked lists (lab: dummy headed circular doubly)", ["J2", "Py 10 B I", "C 5 I S"]],
        ["5", "Stacks on arrays and lists", ["J3 B", "Py 4 B", "C 4 B", "C 6 I"]],
        ["6", "Queues on arrays and lists", ["J3 I", "Py 4 I", "C 4 I"]],
        ["7", "Recursion", ["J4 B S", "Py 6 I", "C 3 I"]],
        ["8", "Hash table and hashing", ["J5", "C 6 S"]],
        ["9", "Trees and BST", ["J6", "Py 12 S", "C 10 I S"]],
        ["10", "Heap", ["J7", "C 14 S"]],
        ["Lab 9", "Searching and sorting", ["J4 I", "Py 4 S", "C 4 S"]],
        ["Lab 11", "Tree and graph", ["J8 B", "C 14 I"]]
      ],
      gaps: ""
    },
    {
      id: "250", name: "CSE250 Circuits and Electronics", note: "Labs use LTSpice. Check every solver against it.",
      url: "https://cse.bracu.ac.bd/course/view/CSE250",
      rows: [
        ["1", "Voltage, current, power, passive sign convention", ["Py 1 B", "C 1 B"]],
        ["2", "Ohm's law, series and parallel, KCL, supernode, current divider", ["Py 1 I", "Py 6 B", "C 3 B"]],
        ["3", "KVL, supermesh, equivalence, source transformation", ["Py 6 S", "Py 16 S", "J8 S"]],
        ["4", "Nodal analysis with dependent sources and supernodes", ["Py 16 B I S", "C 11 S"]],
        ["5", "Mesh analysis with dependent sources and supermeshes", ["Py 16 S"]],
        ["6", "Superposition and Thevenin", ["Py 16 S"]],
        ["7", "Test sources, maximum power transfer, Norton", ["Py 16 S"]],
        ["8", "Capacitors, inductors, RC transient", ["Py 17 B", "Py 20 I"]],
        ["9", "RL transient, complex numbers, AC, RMS", ["Py 11 I", "Py 17 B I", "C 11 B"]],
        ["10", "Impedance, phasor analysis, instantaneous power, AC superposition", ["Py 11 B I", "Py 17 I", "C 11 I", "C 12 B"]]
      ],
      gaps: ""
    },
    {
      id: "320", name: "CSE320 Data Communications", note: "Python for signals, C++ for bit level work, Java for sockets.",
      url: "https://cse.bracu.ac.bd/course/view/CSE320",
      rows: [
        ["1", "Elements of data communication, topology, protocols", ["Py 5 B I", "C 14 B", "J8 I"]],
        ["2", "OSI and TCP/IP models", ["Py 5 B", "Py 11 S", "C 12 S"]],
        ["3", "Signals, impairments, data rate limits", ["Py 1 S", "C 1 I"]],
        ["4", "Line coding, block coding, scrambling", ["Py 3 I", "C 12 I"]],
        ["5", "Analog to digital: PCM, DM", ["Py 7 B I"]],
        ["7", "Digital to analog: ASK, FSK, PSK", ["Py 17 S", "Py 21 I"]],
        ["8", "Multiplexing: FDM, WDM, synchronous TDM", ["Py 12 B"]],
        ["9", "Spreading: FHSS and DSSS", ["Py 17 S"]],
        ["10", "Multiple access: channel partitioning, random access, taking turns", ["Py 19 S", "C 18 I S", "J10 S"]],
        ["11", "Error detection: Hamming distance, block coding, CRC, checksum", ["Py 2 I S", "Py 14 S", "C 1 S", "C 2 I S"]]
      ],
      gaps: "Scrambling techniques (week 4) and FDM and WDM (week 8) have no project. Cover them by hand. Extras beyond the outline, such as framing and sockets, sit in Python 3 and 19, C++ 7 and Java 10."
    }
  ],

  extras: [
    {
      key: "py", name: "Python", url: "https://roadmap.sh/python",
      groups: [
        { title: "Language depth", items: [
          ["regex", "Regular expressions", "The re module, groups, lookahead. Build a log line parser."],
          ["builtins", "Built in functions tour", "map, zip, enumerate, any, all, sorted, min and max with key. Rewrite two old projects with them."],
          ["collections", "collections, heapq and bisect", "deque, Counter, defaultdict, heapq, bisect. Replace hand rolled code in your sorting and queue projects."],
          ["dunder", "Dunder methods beyond the basics", "__getitem__, __iter__, __enter__, __call__ and __slots__ on a small container class."]
        ] },
        { title: "Environments and packaging", items: [
          ["pip", "pip and PyPI", "install, freeze, requirements files. Publish a test package to TestPyPI."],
          ["venv", "virtualenv and pyenv", "Run two Python versions side by side with isolated environments."],
          ["uv", "uv", "Project init, lock files and running scripts with uv."],
          ["poetry", "Poetry and pyproject.toml", "Dependency groups, build backend and version pins."],
          ["conda", "Conda and Pipenv", "Know when each one is used and set up one scientific environment."]
        ] },
        { title: "Frameworks", items: [
          ["flask", "Flask", "Routes, blueprints and templates. Rebuild your to do API."],
          ["django", "Django", "Models, ORM, admin and auth. Rebuild the library system."],
          ["aiohttp", "aiohttp", "An async client and a small async server."],
          ["dash", "Plotly Dash", "A dashboard for your lab measurements."],
          ["others", "Pyramid, Tornado, Sanic and gevent", "Read the docs and compare one request cycle in each."]
        ] },
        { title: "Quality and delivery", items: [
          ["format", "black, ruff format and yapf", "Run all three on one repo and compare the diffs."],
          ["pyright", "pyright and pyre", "Run them next to mypy on your packages and note the differences."],
          ["pydantic", "Pydantic in depth", "Models, validators, settings and serialization."],
          ["unittest", "unittest, doctest and nose style tests", "Port one pytest suite to unittest and add doctests."],
          ["tox", "tox", "Test across several Python versions."],
          ["sphinx", "Sphinx documentation", "Turn docstrings into an HTML site."],
          ["devops", "DevOps basics for Python", "Docker image, GitHub Actions and one deployed service."]
        ] }
      ]
    },
    {
      key: "cpp", name: "C++", url: "https://roadmap.sh/cpp",
      groups: [
        { title: "Tooling", items: [
          ["cvscpp", "C versus C++", "Port a small C program to C++ and list what changed."],
          ["compilers", "GCC, Clang, MSVC and MinGW", "Build one project with two compilers and compare warnings."],
          ["make", "Makefile and Ninja", "Build one project with a Makefile and with CMake plus Ninja."],
          ["pkg", "vcpkg and Conan", "Add fmt and spdlog to a CMake project with one package manager."],
          ["gdb", "GDB and debugging symbols", "Breakpoints, watchpoints and a core dump on a crashing program."],
          ["standards", "C++11, 14, 17, 20 and newer", "List the features each standard added and port one project to C++20."],
          ["profilers", "Profilers: perf and Orbit", "Profile your matrix multiply and report the hot spots."]
        ] },
        { title: "Language depth", items: [
          ["rtti", "Static typing, dynamic typing and RTTI", "typeid, dynamic_cast and the cost of RTTI."],
          ["casts", "static_cast, const_cast, dynamic_cast and reinterpret_cast", "When each is legal and which ones are code smells."],
          ["auto", "auto and type deduction", "Deduction rules for auto, decltype and templates."],
          ["ub", "Undefined behavior catalog", "Signed overflow, dangling references and out of bounds access, and how UBSan reports each."],
          ["adl", "Argument dependent lookup", "Write a case where ADL picks a function you did not expect."],
          ["macros", "Macros and name mangling", "Preprocessor pitfalls, extern C, nm and c++filt."],
          ["exceptions", "Exceptions, exit codes and access violations", "Exception safety levels, noexcept, exit codes and segfault causes."],
          ["multi", "Multiple and diamond inheritance", "Virtual inheritance and object layout."],
          ["vtable", "Virtual tables", "Inspect vtable layout and measure the cost of virtual calls."],
          ["headers", "Namespaces, headers and forward declarations", "Split a project into headers and sources and fix an include cycle."]
        ] },
        { title: "Templates and idioms", items: [
          ["variadic", "Variadic templates", "Write a type safe printf."],
          ["specialize", "Full and partial template specialization", "Specialize a container for bool and for pointers."],
          ["traits", "Type traits and SFINAE", "enable_if first, then concepts as the modern replacement."],
          ["idioms", "Non copyable, erase remove, copy and swap, copy on write", "Implement each on a small class."],
          ["pimpl", "Pimpl and CRTP", "Hide a class implementation behind Pimpl, then write a CRTP counter."]
        ] },
        { title: "Libraries", items: [
          ["chrono", "iostream and chrono", "Formatting streams and timing code with std::chrono."],
          ["boost", "Boost", "Use Boost.Asio or Program_options in one tool."],
          ["gmock", "gtest, gmock and Catch2", "Mock a dependency in the frame tool."],
          ["fmt", "fmt, spdlog and ranges-v3", "Replace stream formatting, add logging and try ranges-v3."],
          ["grpc", "protobuf and gRPC", "Define a service for the similarity search and call it from Python."],
          ["opencv", "OpenCV", "Load, filter and save images from C++."],
          ["qt", "Qt", "A small GUI for your circuit solver."],
          ["mlcpp", "LibTorch, TensorFlow and OpenCL", "Run a model with LibTorch and read through the OpenCL hello world."]
        ] }
      ]
    },
    {
      key: "java", name: "Java", url: "https://roadmap.sh/java",
      groups: [
        { title: "Foundation gap check", items: [
          ["cast", "Type casting and strings", "Widening, narrowing, String methods, StringBuilder and immutability."],
          ["lifecycle", "Program lifecycle, packages and modules", "javac, classpath, packages and JPMS modules."],
          ["static", "Static, nested classes and initializer blocks", "Write one example of each and explain initialization order."],
          ["final", "final, enums and records", "Model a small domain with enums and records."],
          ["binding", "Overloading, overriding and binding", "Static versus dynamic binding with a worked example."],
          ["passing", "Pass by value, method chaining and annotations", "Explain pass by value in Java and write a custom annotation."]
        ] },
        { title: "Core libraries", items: [
          ["collections", "Array versus ArrayList, Set, Map, Queue, Stack, Deque and Iterator", "Pick the right collection for five scenarios and benchmark them."],
          ["optional", "Optional and exception handling", "Refactor null checks to Optional and design a checked exception policy."],
          ["io", "I/O and file operations", "java.io versus NIO.2. Read a large file in streaming mode."],
          ["time", "Date and time API", "java.time, zones and durations."],
          ["regex", "Regular expressions", "Parse log lines with Pattern and Matcher."],
          ["functional", "Functional programming", "Functional interfaces, composition and higher order functions."],
          ["crypto", "Cryptography basics", "Hashing, HMAC and AES with javax.crypto. Never roll your own."]
        ] },
        { title: "Concurrency and networking", items: [
          ["virtual", "Virtual threads", "Compare against platform threads on 10000 blocking tasks."],
          ["jmm", "Java memory model and volatile", "Write a visibility bug and fix it."],
          ["net", "Networking", "HttpClient, URL handling and sockets beyond the echo server."]
        ] },
        { title: "Tooling and frameworks", items: [
          ["build", "Maven and Gradle", "Build the REST API with both and learn the lifecycle."],
          ["di", "Dependency injection", "Write a tiny DI container with reflection before relying on Spring."],
          ["logging", "SLF4J, Logback and Log4j2", "Structured logging with levels and rotation."],
          ["quarkus", "Quarkus, Play and Javalin", "Rebuild the REST API in Quarkus or Javalin and compare startup and memory."],
          ["jdbc", "JDBC", "Raw SQL with PreparedStatement and transactions."],
          ["hibernate", "Hibernate and Spring Data JPA in depth", "N plus 1 queries, lazy loading and caching."]
        ] },
        { title: "Testing", items: [
          ["testng", "TestNG and parameterized tests", "Port a JUnit suite and compare."],
          ["mockito", "Mockito", "Mock the Python service client in the gateway."],
          ["restassured", "REST Assured", "Integration tests for your REST API."],
          ["jmeter", "JMeter", "Load test the gateway and report p95 latency."],
          ["cucumber", "Cucumber-JVM", "Write two behavior tests in plain language."]
        ] }
      ]
    },
    {
      key: "ai", name: "AI Engineer", url: "https://roadmap.sh/ai-engineer",
      groups: [
        { title: "Foundations", items: [
          ["roles", "AI engineer versus ML engineer", "Write a one page note on the two roles and where you fit."],
          ["terms", "LLM terminology", "Inference, training, embeddings, vector databases, RAG and agents. Write a glossary in your own words."]
        ] },
        { title: "Models and APIs", items: [
          ["models", "Pre-trained models and their limits", "Compare several hosted models on the same 10 prompts, noting context length and knowledge cutoff."],
          ["api", "Chat completions API", "Call a hosted model API from Python with streaming and a system prompt."],
          ["tokens", "Managing tokens", "Token counter and a cost estimator for your RAG pipeline."],
          ["finetune", "Fine tuning", "Fine tune a small open model with LoRA and compare against prompting."],
          ["prompting", "Prompt engineering", "Few shot, chain of thought and structured outputs, with a small eval harness."],
          ["cloud", "Azure AI and AWS SageMaker", "Deploy one hosted model endpoint."]
        ] },
        { title: "Safety", items: [
          ["injection", "Prompt injection and adversarial testing", "Attack your own RAG service and patch it."],
          ["bias", "Bias, fairness, security and privacy", "Write a risk note for the study assistant."],
          ["moderation", "Moderation and constrained outputs", "Moderation API, output schemas and end user IDs."]
        ] },
        { title: "Open source AI", items: [
          ["hf", "Hugging Face Hub, tasks and Inference SDK", "Find, download and run three models for different tasks."],
          ["ollama", "Ollama and local models", "Run a local model and call it from Python and from the Java gateway."],
          ["tjs", "Transformers.js", "A small in browser inference demo."]
        ] },
        { title: "Embeddings and vector databases", items: [
          ["embuse", "Embedding use cases", "Build two of: semantic search, recommendations, anomaly detection, classification."],
          ["st", "Sentence Transformers and open source embeddings", "Compare open embeddings with a hosted embedding API on your eval set."],
          ["vdb", "Vector databases", "Index one corpus in two stores such as Chroma, Qdrant, FAISS or pgvector and compare recall and latency."]
        ] },
        { title: "RAG and agents", items: [
          ["chunk", "Chunking and retrieval tuning", "Compare three chunk sizes on your eval set."],
          ["frameworks", "LangChain and LlamaIndex", "Rebuild your RAG with a framework and note what it hides."],
          ["ragvsft", "RAG versus fine tuning", "Write a decision note with your measured results."],
          ["react", "ReAct prompting and function calling", "A tool use loop with two tools."],
          ["agent", "Build an AI agent", "An agent that answers questions over your notes and runs your circuit solver as a tool."]
        ] },
        { title: "Multimodal and tools", items: [
          ["vision", "Image understanding and generation", "Describe circuit diagrams from images and generate one test image."],
          ["audio", "Speech to text and text to speech", "Transcribe a lecture with Whisper and index it."],
          ["editors", "AI code editors and completion tools", "Write a short note on where assistance helped or hurt your learning."]
        ] }
      ]
    }
  ],

  guide: [
    {
      id: "method", title: "How the ladder works",
      html: `
<p>Every topic gets a 20 minute lesson and then exactly three projects at three levels. No topic is done until all three are finished.</p>
<table>
<thead><tr><th>Step</th><th>Time box</th><th>What you do</th></tr></thead>
<tbody>
<tr><td>Lesson</td><td>20 min</td><td>Learn the topic from any source. Take no notes longer than 5 lines.</td></tr>
<tr><td>Beginner project</td><td>30 min</td><td>Works on the happy path, one file, and you can explain every line. Run it with 3 different inputs.</td></tr>
<tr><td>Intermediate project</td><td>60 min</td><td>Survives bad input, split into functions or classes, at least 5 tests.</td></tr>
<tr><td>Senior project</td><td>90 min</td><td>Write a half page design note first: inputs, outputs, edge cases, one tradeoff. Then a clean API, edge case tests, lint and type or sanitizer clean, and a README with the tradeoff and a complexity or benchmark note.</td></tr>
<tr><td>Total per topic</td><td>3 h 20 min</td><td></td></tr>
</tbody></table>
<p><b>Senior is a quality bar, not a size.</b> A 90 minute project cannot be large, so the scope stays small and the standard stays high. If you finish early, spend the time on tests and the design note, not on extra features.</p>
<h3>Rules for every topic</h3>
<ol>
<li><b>Cumulative:</b> each project must use the new topic plus at least two earlier topics. If a listed project does not, add the missing pieces yourself.</li>
<li><b>From scratch:</b> no starter code and no copying. After finishing, compare with a reference solution and write 2 lines on what differed.</li>
<li><b>No skipping tiers:</b> a failed tier is redone the next day before the new lesson starts.</li>
<li><b>Reuse:</b> the Python and C++ ladders share several project ideas on purpose. Building the same design twice shows you what each language changes.</li>
<li><b>Commit:</b> one repo folder per project, committed when the tier is done.</li>
</ol>
<h3>Course rules</h3>
<ol>
<li><b>Solve by hand first.</b> The program verifies your answer, it never replaces the working. Exams are on paper, and graded assignments must be your own work.</li>
<li><b>Cross check every output</b> against LTSpice, a textbook worked example or a hand calculation before the tier counts as done.</li>
<li><b>Class order wins.</b> Do a course project in the week your class reaches that topic. If class runs ahead of this plan, move the project up and push a skill project later.</li>
<li><b>Outlines are general.</b> The coverage comes from the department course pages. Your instructor's outline may order or weight topics differently, so edit the plan where it differs.</li>
</ol>
<h3>Tags on projects</h3>
<p>The tag on each project says what it serves. CSE220, CSE250 and CSE320 are your courses. All courses means it uses all three. Skill means the topic has no course fit, such as PyTorch, and the project exists for the AI engineer goal.</p>`
    },
    {
      id: "rhythm", title: "Daily and weekly rhythm",
      html: `
<p>A standard weekday is 5 hours, split by phase. Do C++ first while you are fresh, Python second, Java last.</p>
<table>
<thead><tr><th>Block</th><th>Weeks 1 to 4</th><th>Weeks 5 to 8</th></tr></thead>
<tbody>
<tr><td>C++</td><td>2 h</td><td>1.5 h</td></tr>
<tr><td>Python</td><td>2 h</td><td>2.5 h</td></tr>
<tr><td>Java</td><td>1 h</td><td>1 h</td></tr>
<tr><td>Total</td><td>5 h</td><td>5 h</td></tr>
</tbody></table>
<ul>
<li><b>4 hour days:</b> Java drops to 30 min and the rest splits evenly between C++ and Python.</li>
<li><b>6 hour days:</b> the extra hour goes to the week's project.</li>
<li><b>Inside every block:</b> 20 min reading docs, 30 min drills typed from scratch, the rest building, and the last 10 min committing code and writing a 3 line log.</li>
</ul>
<h3>Weekly rhythm</h3>
<ol>
<li>Monday to Thursday: new topics, each with its lesson and three projects.</li>
<li>Friday: rebuild day, or a gate project when one is due. Delete the week's key code and rewrite it from memory.</li>
<li>Saturday: ship day. Finish any unfinished tier, then ship the week's repos with READMEs.</li>
<li>Sunday: 2 hours of review and notes, then rest. No new material.</li>
</ol>
<h3>Gates</h3>
<p>A gate is one 2.5 hour project that combines everything learned in that language so far. It replaces a Friday rebuild day. A gate passes only if the repo runs from a fresh clone, has tests and has a README. A failed gate is redone before the next lesson.</p>
<h3>Falling behind</h3>
<p>Never skip a senior project to catch up. Drop the lesson reading to 10 minutes first, then push the topic to the next day and shift the rest.</p>
<h3>Exam rule</h3>
<p>In the week before any quiz or exam, run your own tools against practice problems you solved by hand. A mismatch is a bug in your hand working or in your code, and either way you learn which topic is weak.</p>`
    },
    {
      id: "rules", title: "Language rules",
      html: `
<h3>All languages</h3>
<ul>
<li>Spend 30% of time learning and 70% building. Read official docs, not video chains.</li>
<li>Write every project from scratch first, then compare against a reference solution.</li>
<li>A project is not done without tests, a README and a commit history.</li>
<li>Solve one algorithm problem daily, alternating C++ and Python, capped at 30 min inside that language block. If stuck at 30 min, read the solution and re-solve it the next day.</li>
<li>Use an AI assistant only after 20 min of your own attempt, and only to review code or explain an error. Never to write the first version.</li>
</ul>
<h3>C++</h3>
<ul>
<li>Always compile with <code>-Wall -Wextra -fsanitize=address,undefined</code>.</li>
<li>From week 2: no raw <code>new</code> or <code>delete</code>. Use RAII and smart pointers.</li>
<li>From week 2: build with CMake and test with Catch2 or GoogleTest.</li>
<li>Debug pointer and memory bugs with gdb or lldb, not print statements.</li>
</ul>
<h3>Python</h3>
<ul>
<li>One virtual environment per project, type hints on every function, <code>ruff</code> and <code>mypy</code> clean, tests in <code>pytest</code>.</li>
<li>Weeks 1 and 2: standard library only. No frameworks.</li>
<li>No pandas before week 3. Learn plain lists, dicts and sets first.</li>
</ul>
<h3>Java</h3>
<ul>
<li>JUnit from day one. No Spring until topic 12.</li>
<li>Read 1 to 2 items of Effective Java daily and apply each one in that day's code.</li>
<li>Every concurrency or JVM topic gets a small benchmark that proves the claim.</li>
</ul>`
    },
    {
      id: "extras", title: "Main plan and extra steps",
      html: `
<p><b>Main tasks</b> are the 8 week plan: 56 lessons, 168 projects, 7 gates and 3 capstones. They carry the main progress and they come first.</p>
<p><b>Extra steps</b> are everything else on the roadmap.sh roadmaps for Python, C++, Java and AI Engineer that the main plan does not already cover. They have their own progress and never block the main plan. Take them when a week's gate is done or when you are ahead.</p>
<p>Topics the main plan already covers, such as loops, classes, smart pointers or RAG, are not repeated in the extras.</p>`
    },
    {
      id: "reality", title: "Reality check and exit criteria",
      html: `
<p>Eight weeks gives you senior grade foundations and habits in all three languages. It does not give you seniority, which comes from shipping and maintaining systems over years.</p>
<ul>
<li><b>Python</b> is the core of AI engineering and gets the most hours.</li>
<li><b>C++</b> is the performance edge: memory, STL, concurrency and binding kernels into Python.</li>
<li><b>Java</b> is the lowest return for AI work and you already have the foundation, so it gets the smallest share.</li>
<li><b>Output:</b> by week 8 you have one capstone system that uses all three languages.</li>
</ul>
<h3>Exit criteria on day 56</h3>
<p>Pass these three tests with no references open.</p>
<ul>
<li><b>Python:</b> write a typed, tested FastAPI service and a NumPy implementation of a learning algorithm from a blank file.</li>
<li><b>C++:</b> write a class with move semantics and a thread safe queue, clean under the sanitizers.</li>
<li><b>Java:</b> explain how the garbage collector and thread pool behave in your gateway, then find and fix a planted concurrency bug.</li>
</ul>
<p><b>Sunday self check:</b> What did I ship this week? What did I copy without understanding? What will I rebuild next week?</p>
<h3>Capstones</h3>
<p>The three capstones form one system. Done means one command starts all three, a request flows gateway to Python to C++ and back, every part has tests, and the architecture README and benchmark numbers are public.</p>
<h3>Resources</h3>
<ul>
<li>C++: learncpp.com, then A Tour of C++.</li>
<li>Python: the official Python tutorial, then Fluent Python from week 3.</li>
<li>Java: Effective Java and Java Concurrency in Practice.</li>
<li>AI: Karpathy's Zero to Hero series and the PyTorch tutorials.</li>
<li>Courses: Algorithms in Java by Sedgewick and Wayne for CSE220, Alexander and Sadiku for CSE250, Forouzan for CSE320.</li>
</ul>
<p>Pick one resource per language and stay on it. Switching resources is the most common way to stall.</p>`
    },
    {
      id: "sources", title: "Sources",
      html: `
<ul>
<li><a href="https://cse.bracu.ac.bd/course/view/CSE220" rel="noopener">CSE220 course page</a>, <a href="https://cse.bracu.ac.bd/course/view/CSE250" rel="noopener">CSE250 course page</a> and <a href="https://cse.bracu.ac.bd/course/view/CSE320" rel="noopener">CSE320 course page</a> on the BRACU CSE site, read on 2026-10-20.</li>
<li>roadmap.sh roadmaps for <a href="https://roadmap.sh/python" rel="noopener">Python</a>, <a href="https://roadmap.sh/cpp" rel="noopener">C++</a>, <a href="https://roadmap.sh/java" rel="noopener">Java</a> and <a href="https://roadmap.sh/ai-engineer" rel="noopener">AI Engineer</a>, topic lists read from their published PDFs on 2026-10-21.</li>
</ul>`
    }
  ]
};
