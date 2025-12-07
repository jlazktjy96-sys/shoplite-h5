const LS_CART_KEY = 'shoplite.cart.v1';

const products = [
  {id:'sku-1001', title:'无线蓝牙耳机', price:19900},
  {id:'sku-1002', title:'智能手环', price:25900},
  {id:'sku-1003', title:'Type-C 充电线', price:3900},
  {id:'sku-1004', title:'65W 氮化镓充电器', price:12900},
  {id:'sku-1005', title:'便携移动电源', price:15900},
  {id:'sku-1006', title:'机械键盘（87键）', price:28900},
];

let cart = {}; // {id: qty}

function formatCNY(cents){ return (cents/100).toFixed(2); }

function loadCart(){
  try{ const raw = localStorage.getItem(LS_CART_KEY); cart = raw ? JSON.parse(raw) : {}; }catch{ cart = {}; }
}
function saveCart(){
  try{ localStorage.setItem(LS_CART_KEY, JSON.stringify(cart)); }catch{}
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb">${p.title.substring(0,6)}</div>
      <div class="info">
        <h3 class="title">${p.title}</h3>
        <div class="row">
          <div class="price">¥ ${formatCNY(p.price)}</div>
          <button class="btn primary" data-id="${p.id}">加入购物车</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
  grid.querySelectorAll('button[data-id]').forEach(btn=>{
    btn.addEventListener('click', ()=>{ addToCart(btn.dataset.id, 1); });
  });
}

function addToCart(id, qty){
  cart[id] = (cart[id]||0) + qty;
  saveCart();
  updateCartBadge();
  renderCart();
  openCart();
}
function setQty(id, qty){
  cart[id] = Math.max(0, qty|0);
  if(cart[id]===0) delete cart[id];
  saveCart();
  updateCartBadge();
  renderCart();
}
function removeItem(id){ setQty(id, 0); }

function cartSummary(){
  let qty = 0, amt = 0;
  Object.entries(cart).forEach(([id, q])=>{
    const p = products.find(x=>x.id===id);
    if(!p) return; qty += q; amt += q*p.price;
  });
  return {qty, amt};
}

function renderCart(){
  const box = document.getElementById('cartItems');
  box.innerHTML = '';
  Object.entries(cart).forEach(([id, q])=>{
    const p = products.find(x=>x.id===id);
    if(!p) return;
    const row = document.createElement('div');
    row.className = 'item';
    row.innerHTML = `
      <div>${p.title}</div>
      <div class="qty">
        <button class="btn" data-act="dec" data-id="${id}">－</button>
        <input type="number" min="0" value="${q}" data-id="${id}" style="width:56px">
        <button class="btn" data-act="inc" data-id="${id}">＋</button>
      </div>
      <div>¥ ${formatCNY(p.price*q)}</div>`;
    box.appendChild(row);
  });

  box.querySelectorAll('button[data-act]').forEach(b=>{
    b.addEventListener('click',()=>{
      const id = b.dataset.id; const q = cart[id]||0;
      setQty(id, b.dataset.act==='inc' ? q+1 : q-1);
    });
  });
  box.querySelectorAll('input[type="number"]').forEach(inp=>{
    inp.addEventListener('change',()=> setQty(inp.dataset.id, parseInt(inp.value||'0',10)) );
  });

  const {qty, amt} = cartSummary();
  document.getElementById('cartTotal').textContent = formatCNY(amt);
}

function updateCartBadge(){ document.getElementById('cartCount').textContent = cartSummary().qty; }

function openCart(){ document.getElementById('cartDrawer').classList.add('open'); }
function closeCart(){ document.getElementById('cartDrawer').classList.remove('open'); }

function openCheckout(){
  const s = cartSummary();
  document.getElementById('sumQty').textContent = s.qty;
  document.getElementById('sumAmt').textContent = formatCNY(s.amt);
  document.getElementById('checkoutPanel').classList.add('show');
}
function closeCheckout(){ document.getElementById('checkoutPanel').classList.remove('show'); }

function bindUI(){
  document.getElementById('btnCart').addEventListener('click', openCart);
  document.getElementById('btnCloseCart').addEventListener('click', closeCart);
  document.getElementById('btnCheckout').addEventListener('click', openCheckout);
  document.getElementById('btnCloseCheckout').addEventListener('click', closeCheckout);

  document.getElementById('checkoutForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('buyerName').value.trim();
    const phone = document.getElementById('buyerPhone').value.trim();
    const addr = document.getElementById('buyerAddr').value.trim();
    if(!name || !phone || !addr){ alert('请完整填写收货信息'); return; }
    const s = cartSummary();
    alert(`下单成功！\n收货人：${name}\n电话：${phone}\n地址：${addr}\n商品：${s.qty} 件\n金额：¥ ${formatCNY(s.amt)}`);
    cart = {}; saveCart(); updateCartBadge(); renderCart(); closeCheckout(); closeCart();
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  loadCart();
  renderProducts();
  renderCart();
  updateCartBadge();
  bindUI();
});

