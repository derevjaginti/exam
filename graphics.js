function process(canvas, imageData, func) {
    function setPixel(imageData, x, y, rgba) {
        var index = (x + y * imageData.width) * 4;
 
        for (var i = 0; i < 4; i++) {
            if (imageData.data[index + i] === 0){
                imageData.data[index + i] = rgba[i] * 255;
            }
        }
    }
 
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            var result = func(new Point(x, y));
            setPixel(imageData, x, y, result);
        }
    }
}

function getColor(color, local_max, local_min, alpha){
    var d=local_max-local_min;
    var r=1.0/d;
    var mid=(local_max+local_min)/2;
    if(color<local_min)return [0,0,1,alpha];
    else if(color>local_max)return [1,0,0,alpha];
    else if(color==mid) return [0.3,0.5,0.3,alpha];
    else if(color>mid) return [Math.abs(r*(color-local_min)),Math.abs(r*(color-local_max)),0,alpha];
    else return [0,Math.abs(r*(color-local_min)),Math.abs(r*(color-local_max)),alpha];
}

function drawTriangle (canvas, imageData, triangle) {
    var padding = canvas.width * 0.1;
    
    // var c0 = Math.abs(triangle[0].t-window.minT)/Math.abs(window.maxT-window.minT);  
    // var c1 = Math.abs(triangle[1].t-window.minT)/Math.abs(window.maxT-window.minT);  
    // var c2 = Math.abs(triangle[2].t-window.minT)/Math.abs(window.maxT-window.minT);  
    
    // triangle[0].color = Color().rgb(window.minColor).mix(Color().rgb(window.maxColor), c0).values.rgb;
    // triangle[1].color = Color().rgb(window.minColor).mix(Color().rgb(window.maxColor), c1).values.rgb;
    // triangle[2].color = Color().rgb(window.minColor).mix(Color().rgb(window.maxColor), c2).values.rgb;
    
    triangle[0].color = getColor(triangle[0].t, window.maxT, window.minT, 0.4);
    triangle[1].color = getColor(triangle[1].t, window.maxT, window.minT, 0.4);
    triangle[2].color = getColor(triangle[2].t, window.maxT, window.minT, 0.4);
    
    // triangle[0].color[0] = triangle[0].color[0]/255;
    // triangle[0].color[1] = triangle[0].color[1]/255;
    // triangle[0].color[2] = triangle[0].color[2]/255;
    // triangle[0].color[3] = 0.4;
    
    // triangle[1].color[0] = triangle[1].color[0]/255;
    // triangle[1].color[1] = triangle[1].color[1]/255;
    // triangle[1].color[2] = triangle[1].color[2]/255;
    // triangle[1].color[3] = 0.4;
    
    // triangle[2].color[0] = triangle[2].color[0]/255;
    // triangle[2].color[1] = triangle[2].color[1]/255;
    // triangle[2].color[2] = triangle[2].color[2]/255;
    // triangle[2].color[3] = 0.4;
    
    var triangleGradient = function(point) {
        var DEFAULTCOLOR = [0, 0, 0, 0];
        var ret = [0, 0, 0, 0];

        for (var i = 0; i < 3; i++) {
            var v1 = triangle.edges[i][0];
            var v2 = triangle.edges[i][1];
            var v3 = triangle[i];
            var isect = intersectLines(v1, v2, v3, point);

            if (isect) {
                var pointVertexDist = distance(point, v3);
                var isectVertexDist = distance(isect, v3);

                if (pointVertexDist <= isectVertexDist) {
                    var lerpFac = 1 - pointVertexDist /
                        isectVertexDist;

                    for (var j = 0; j < ret.length; j++) {
                        ret[j] += v3.color[j] * lerpFac;
                    }
                } else {
                    return DEFAULTCOLOR;
                }
            } else {
                return DEFAULTCOLOR;
            }
        }

        return ret;
    }
    
    process(canvas, imageData, triangleGradient);
}