class Cons {
  constructor(car, cdr) {
    this.car = car;
    this.cdr = cdr;
  }
}

function listContains(list, val) {
  while (list !== null) {
    if (list.car === val) {
      return true;
    }
    list = list.cdr;
  }
  return false;
}

class CellEvent {
  constructor(payload, sources = null) {
    this.payload = payload;
    this.sources = sources;
  }

  addSource(source) {
    return new CellEvent(this.payload, new Cons(source, this.sources));
  }

  static get(source, payload) {
    return new CellEvent(payload, new Cons(source, null));
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
    for (var pair of this.listeners) {
      var listener = pair[0];
      var target = pair[1];

      if (!listContains(e.sources, target)) {
        listener(e.addSource(this.source), target);
      }
    }
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
        this.subject.emit(e.addSource(this));
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
