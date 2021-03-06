var snowflake = (function() {
  function drawFlake(context, options) {
    var deg = Math.PI / 180;
    var segment_length = options.segment_length;
    context.save();
    context.strokeStyle = options.color;
    context.fillStyle = options.color;
    context.lineWidth = options.lineWidth;
    context.translate(0, options.segment_length);
    context.beginPath();
    context.moveTo(0, 0);
    leg(options.depth);   
    context.rotate(-120 * deg);   
    leg(options.depth);
    context.rotate(-120 * deg);
    leg(options.depth);
    context.closePath();
    context.fill();
    context.restore();
    
    function leg(depth) {
      context.save();
      if (depth === 0) {
        context.lineTo(segment_length, 0);
      } else {
        context.scale(1/3, 1/3);
        leg(depth - 1);
        context.rotate(60 * deg);
        leg(depth - 1);
        context.rotate(-120 * deg);
        leg(depth - 1);
        context.rotate(60 * deg);
        leg(depth - 1);
      }
      context.restore();
      context.translate(segment_length, 0);
    }
  }

  function createFlakeImage(options) {
    var temp_canvas = document.createElement("canvas");
    var temp_context = temp_canvas.getContext("2d");
    var img = new Image();
    temp_canvas.width = options.segment_length * 2;
    temp_canvas.height = options.segment_length * 2;
    drawFlake(temp_context, options);
    img.src = temp_canvas.toDataURL();
    
    return img;
  }
  
  var snowflake = oFactory({
    draw: function(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.scale(this.scale_x, this.scale_y);
      context.globalAlpha = this.alpha;
      if (this.image) {
        context.drawImage(this.image, 0, 0);
      } else {
        drawFlake(context, this);
      }
      context.restore();
    }
    
  }).mixin({
    depth: 1,
    segment_length: 50,
    color: "#ffffff",
    lineWidth: 1,
    x: 0,
    y: 0,
    rotation: 0,
    scale_x: 1,
    scale_y: 1
  });
  
  snowflake.cacheImages = function(min, max, options) {
    options = options || {};
    var cached_images = [];
    options.lineWidth = options.lineWidth === undefined ? 1 : options.lineWidth;
    options.segment_length = options.segment_length || 50;
    options.color = options.color || "#ffffff";
  
    for (i = min; i < max; i++) {
      options.depth = i;
      cached_images.push(createFlakeImage(options));
    }
    
    snowflake.cached_images = cached_images;
  }
  
  return snowflake;
})();
