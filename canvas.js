function picassoCanvas(roundNumber, seed, params) {
    const {area, offsetParameter, multiplier, fontSizeFactor, maxShadowBlur} = params;

    class Prng {
        constructor(seed) {
            this.currentNumber = seed % offsetParameter;
            if (this.currentNumber <= 0) {
                this.currentNumber += offsetParameter
            }
        }

        getNext() {
            this.currentNumber = multiplier * this.currentNumber % offsetParameter;
            return this.currentNumber;
        }
    }

    function adaptRandomNumberToContext(randomNumber, maxBound, floatAllowed) {
        randomNumber = (randomNumber - 1) / offsetParameter;
        if (floatAllowed) {
            return randomNumber * maxBound;
        }

        return Math.floor(randomNumber * maxBound);
    }

    function addRandomCanvasGradient(prng, context, area) {
        const canvasGradient = context.createRadialGradient(
            adaptRandomNumberToContext(prng.getNext(), area.width),
            adaptRandomNumberToContext(prng.getNext(), area.height),
            adaptRandomNumberToContext(prng.getNext(), area.width),
            adaptRandomNumberToContext(prng.getNext(), area.width),
            adaptRandomNumberToContext(prng.getNext(), area.height),
            adaptRandomNumberToContext(prng.getNext(), area.width)
        );
        canvasGradient.addColorStop(0, colors[adaptRandomNumberToContext(prng.getNext(), colors.length)]);
        canvasGradient.addColorStop(1, colors[adaptRandomNumberToContext(prng.getNext(), colors.length)]);
        context.fillStyle = canvasGradient
    }

    function generateRandomWord(prng, wordLength) {
        const minAscii = 65;
        const maxAscii = 126;
        const wordGenerated = [];
        for (let i = 0; i < wordLength; i++) {
            const asciiCode = minAscii + (prng.getNext() % (maxAscii - minAscii));
            wordGenerated.push(String.fromCharCode(asciiCode));
        }

        return wordGenerated.join('');
    }

    if (!window.CanvasRenderingContext2D) {
        return 'unknown';
    }

    const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

    const primitives = [
        function arc (prng, context, area) {
            context.beginPath();
            context.arc(
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height),
                adaptRandomNumberToContext(prng.getNext(), Math.min(area.width, area.height)),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true)
            );
            context.stroke()
        },
        function text (prng, context, area) {
            const wordLength = Math.max(1, adaptRandomNumberToContext(prng.getNext(), 5));
            const textToStroke = generateRandomWord(prng, wordLength);
            context.font = `${area.height / fontSizeFactor}px aafakefontaa`;

            context.strokeText(
              textToStroke,
              adaptRandomNumberToContext(prng.getNext(), area.width),
              adaptRandomNumberToContext(prng.getNext(), area.height),
              adaptRandomNumberToContext(prng.getNext(), area.width)
            )
        },
        function bezierCurve (prng, context, area) {
            context.beginPath();
            context.moveTo(
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height)
            );
            context.bezierCurveTo(
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height),
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height),
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height)
            );
            context.stroke()
        },
        function quadraticCurve(prng, context, area) {
            context.beginPath();
            context.moveTo(
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height)
            );
            context.quadraticCurveTo(
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height),
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height)
            );
            context.stroke()
        },
        function ellipse(prng, context, area) {
            context.beginPath();
            context.ellipse(
                adaptRandomNumberToContext(prng.getNext(), area.width),
                adaptRandomNumberToContext(prng.getNext(), area.height),
                adaptRandomNumberToContext(prng.getNext(), Math.floor(area.width/2)),
                adaptRandomNumberToContext(prng.getNext(), Math.floor(area.height/2)),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true),
                adaptRandomNumberToContext(prng.getNext(), 2 * Math.PI, true)
            );

            context.stroke()
        }
    ];

    try {
        const prng = new Prng(seed);
        const canvasElt = document.createElement("canvas");
        canvasElt.width = area.width;
        canvasElt.height = area.height;
        canvasElt.style.display = "none";
        const context = canvasElt.getContext("2d");
        for (let i = 0; i < roundNumber; i++) {
            addRandomCanvasGradient(prng, context, area);
            context.shadowBlur = adaptRandomNumberToContext(prng.getNext(), maxShadowBlur);
            context.shadowColor = colors[adaptRandomNumberToContext(prng.getNext(), colors.length)];
            const randomPrimitive = primitives[adaptRandomNumberToContext(prng.getNext(), primitives.length)];
            randomPrimitive(prng, context, area);
            context.fill()
        }

        return canvasElt.toDataURL();
    } catch (e) {}
}