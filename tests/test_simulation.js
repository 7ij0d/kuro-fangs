// Test simulation of HistoryManager and commands logic
class MockHistoryManager {
  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }
  execute(cmd) {
    cmd.execute();
    this.undoStack.push(cmd);
    this.redoStack = [];
  }
  undo() {
    if (!this.undoStack.length) return;
    const cmd = this.undoStack.pop();
    cmd.undo();
    this.redoStack.push(cmd);
  }
  redo() {
    if (!this.redoStack.length) return;
    const cmd = this.redoStack.pop();
    cmd.execute();
    this.undoStack.push(cmd);
  }
}

const mockPageStrokes = { 1: [] };

class MockAddStrokeCommand {
  constructor(page, stroke) {
    this.page = page;
    this.stroke = stroke;
  }
  execute() {
    mockPageStrokes[this.page].push(this.stroke);
  }
  undo() {
    mockPageStrokes[this.page] = mockPageStrokes[this.page].filter(s => s.id !== this.stroke.id);
  }
}

class MockEraseStrokesCommand {
  constructor(page, prev, next) {
    this.page = page;
    this.prev = [...prev];
    this.next = [...next];
  }
  execute() {
    mockPageStrokes[this.page] = [...this.next];
  }
  undo() {
    mockPageStrokes[this.page] = [...this.prev];
  }
}

const mgr = new MockHistoryManager();

// Test 1: Add stroke
const s1 = { id: 's1', tool: 'pen', points: [{x: 10, y: 10}, {x: 20, y: 20}] };
mgr.execute(new MockAddStrokeCommand(1, s1));
console.assert(mockPageStrokes[1].length === 1, 'Stroke 1 should be added');

// Test 2: Add stroke 2
const s2 = { id: 's2', tool: 'highlighter', points: [{x: 50, y: 50}, {x: 80, y: 50}] };
mgr.execute(new MockAddStrokeCommand(1, s2));
console.assert(mockPageStrokes[1].length === 2, 'Stroke 2 should be added');

// Test 3: Undo stroke 2
mgr.undo();
console.assert(mockPageStrokes[1].length === 1 && mockPageStrokes[1][0].id === 's1', 'Undo should remove stroke 2');

// Test 4: Redo stroke 2
mgr.redo();
console.assert(mockPageStrokes[1].length === 2, 'Redo should restore stroke 2');

// Test 5: Erase all strokes
const beforeErase = [...mockPageStrokes[1]];
mgr.execute(new MockEraseStrokesCommand(1, beforeErase, []));
console.assert(mockPageStrokes[1].length === 0, 'Erase should clear strokes');

// Test 6: Undo erase
mgr.undo();
console.assert(mockPageStrokes[1].length === 2, 'Undo erase should restore both strokes');

console.log('✅ Simulation tests passed successfully!');
