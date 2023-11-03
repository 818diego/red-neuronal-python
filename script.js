let modelo;

async function cargarModelo() {
    modelo = await tf.loadLayersModel("model.json");
}

cargarModelo();

async function predecirImagen() {
    const imagenInput = document.getElementById("imagen");
    const resultadoDiv = document.getElementById("resultado");

    if (modelo && imagenInput.files.length > 0) {
        const imagen = imagenInput.files[0];
        const reader = new FileReader();

        reader.onload = async function () {
            const img = new Image();
            img.src = reader.result;
            img.onload = async function () {
                const tensor = tf.browser.fromPixels(img, 1)
                    .resizeBilinear([28, 28])
                    .reshape([1, 784])
                    .div(255);
                const prediction = modelo.predict(tensor);
                const predictedClass = prediction.argMax(1).dataSync()[0];
                resultadoDiv.innerText = `El dígito predicho es: ${predictedClass}`;
            };
        };

        reader.readAsDataURL(imagen);
    } else {
        resultadoDiv.innerText = "Carga una imagen y luego presiona 'Predecir'.";
    }
}
