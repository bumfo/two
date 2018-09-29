class PersistentField {
  constructor(key, defaultValue = null) {
    this.key = key;
    this.prefixedKey = location.pathname + '$' + key;

    if (!this.load()) {
      this.set(defaultValue);
    }
  }

  load() {
    var val = localStorage.getItem(this.prefixedKey);

    if (val === null) {
      return false;
    } else {
      this.value = val;
      return true;
    }
  }

  set(value) {
    this.value = value;
    localStorage.setItem(this.prefixedKey, value);
  }
}

function CellFromField(field) {
  var cell = new Cell(field.value);

  cell.addListener((e, target) => {
    var val = cell.value;

    target.set(val);
  }, field);

  return cell;
}
