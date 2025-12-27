const socket = io();

const form = document.getElementById('postForm');
const nameInput = document.getElementById('name');
const textInput = document.getElementById('text');
const messagesEl = document.getElementById('messages');

function escapeHtml(s){
  return s.replace(/[&<>"']/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]);
}

function renderMessage(m){
  const div = document.createElement('div');
  div.className = 'msg';
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = `${m.name} • ${new Date(m.ts).toLocaleString()}`;
  const text = document.createElement('div');
  text.className = 'text';
  text.innerHTML = escapeHtml(m.text);
  div.appendChild(meta);
  div.appendChild(text);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

socket.on('history', (arr)=>{
  messagesEl.innerHTML = '';
  arr.forEach(renderMessage);
});

socket.on('message', (m)=>{
  renderMessage(m);
});

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const payload = { name: nameInput.value.trim() || 'Anon', text: textInput.value.trim() };
  if(!payload.text) return;
  socket.emit('post', payload);
  textInput.value = '';
});
