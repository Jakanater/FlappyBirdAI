function Pipe() {
  this.gap = 150;
  this.top = random(height / 6, (3 / 4) * height);
  this.bottom = height - this.top - this.gap;
  this.x = width;
  this.w = 40;
  this.speed = 6;
  this.highlight = false;

  this.hits = function (bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    return false;
  }

  this.show = function () {
    fill(255);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);

    if (this.highlight) {
      fill(255, 0, 0);
      rect(this.x, 0, this.w, this.top);
      rect(this.x, height - this.bottom, this.w, this.bottom);
    }
  };

  this.update = function () {
    this.x -= this.speed;
  };

  this.offscreen = function () {
    return this.x < -this.w;
  };
}