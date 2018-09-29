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

  set(value, e = new CellEvent()) {
    this.value = value;

    if (!this.silence) {
      this.silence = true;

      this.subject.emit(e.addSource(this));

      this.silence = false;
    }
  }

  addListener(listener, target) {
    this.subject.addListener(listener, target);
  }
}

function CellFromInputElement(el) {
  var cell = new Cell(null);

  el.addEventListener('input', e => {
    cell.set(el.value);
  });

  cell.addListener(e => {
    var val = cell.value;

    el.value = val === null ? '' : val;
  });

  return cell;
}
