// 3D Fluid Background (Hareketli Arka Plan)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document
  .getElementById("background-container")
  .appendChild(renderer.domElement);

// Mouse hareketine göre kamera ayarları
let mouseX = 0;
let mouseY = 0;
document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Geometri ve shader ile 3D yüzey oluşturma
const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
const material = new THREE.ShaderMaterial({
  vertexShader: `
    uniform float time;
    uniform vec2 mouse;
    
    void main() {
      vec3 newPosition = position;
      
      // Fare hareketine göre z eksenini değiştir
      newPosition.z += sin(position.x * 0.5 + time) * 2.0;
      newPosition.z += cos(position.y * 0.5 + time) * 2.0;
      newPosition.x += sin(position.y * 0.2 + time * 2.0) * 2.0;
      newPosition.y += cos(position.x * 0.2 + time * 2.0) * 2.0;

      // Fare hareketine göre dalma efekti
      newPosition.x += mouse.x * 10.0;
      newPosition.y += mouse.y * 10.0;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(0.0, 0.8, 1.0, 1.0); // Mavi renk
    }
  `,
  uniforms: {
    time: { value: 0 },
    mouse: { value: new THREE.Vector2(0, 0) },
  },
  wireframe: true,
  transparent: true,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 20;

// Animasyon fonksiyonu
function animate() {
  requestAnimationFrame(animate);
  material.uniforms.time.value += 0.05;
  material.uniforms.mouse.value.set(mouseX, mouseY);
  renderer.render(scene, camera);
}

animate();

// Şifreyi gösterme/gizleme işlevi
const togglePassword = document.getElementById("togglePassword");
const passwordField = document.getElementById("password");

togglePassword.addEventListener("click", function () {
  const type = passwordField.type === "password" ? "text" : "password";
  passwordField.type = type;

  // Emoji değişimi
  this.textContent = type === "password" ? "👁️" : "🙈";
});

// Login işlemi
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Sayfa yenilenmesini engelle

    // Kullanıcı adı ve şifre kontrolü
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Kullanıcıyı doğru sayfaya yönlendirme
    window.location.href = "http://127.0.0.1:5500/index.html"; // Yerel dosya yoluna yönlendirme
  });
