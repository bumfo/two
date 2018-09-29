class CellEvent {
  constructor(payload) {
    this.payload = payload;
    this._sources = new Set();
  }

  static get(source, payload) {
    var e = new CellEvent(payload);

    e._sources.add(source);

    return e;
  }
}

class Subject {
  constructor(source) {
    this.source = source;
    this.listeners = [];
  }

  addListener(listener, target) {
    this.listeners.push([listener, target]);
  }

  emit(e) {
    e._sources.add(this.source);

    for (var pair of this.listeners) {
      var listener = pair[0];
      var target = pair[1];

      if (!e._sources.has(target)) {
        listener(e, target);
      }
    }

    e._sources.delete(this.source);
  }
}

class Cell {
  constructor(value) {
    this.value = value;
    this.subject = new Subject(this);
    this.silence = false;
  }

  set(value, e) {
    this.value = value;

    this.fire(e);
  }

  fire(e = new CellEvent()) {
    if (!this.silence) {
      this.silence = true;

      try {
        this.subject.emit(e);
      } finally {
        this.silence = false;
      }
    }
  }

  addListener(listener, target) {
    this.subject.addListener(listener, target);
  }
}

function CellFromInputBox(el) {
  var cell = new Cell(null);

  el.addEventListener('input', e => {
    cell.set(el.value, CellEvent.get(el));
  });

  cell.addListener((e, target) => {
    var val = cell.value;

    target.value = val === null ? '' : val;
  }, el);

  return cell;
}

function CellFromCheckBox(el) {
  var cell = new Cell(null);

  el.addEventListener('change', e => {
    cell.set(el.checked, CellEvent.get(el));
  });

  cell.addListener((e, target) => {
    var val = cell.value;

    if (val !== null) {
      target.checked = val;
    }
    target.indeterminate = val === null;
  }, el);

  return cell;
}

function addRelation(A, f, B) {
  A.addListener((e, target) => {
    target.set(f(A.value), e);
  }, B);    
}
