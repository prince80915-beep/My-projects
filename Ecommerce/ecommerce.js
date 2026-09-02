const products=[
{id:1,name:"Minimal Backpack",price:1299,icon:"🎒",tag:"TRAVEL",desc:"Lightweight everyday backpack."},
{id:2,name:"Desk Lamp",price:899,icon:"💡",tag:"DESK",desc:"Clean light for focused work."},
{id:3,name:"Wireless Headphones",price:2199,icon:"🎧",tag:"AUDIO",desc:"Comfortable sound for your day."},
{id:4,name:"Smart Watch",price:3499,icon:"⌚",tag:"TECH",desc:"Simple tracking and notifications."},
{id:5,name:"Running Shoes",price:2499,icon:"👟",tag:"SPORT",desc:"Everyday shoes for active days."},
{id:6,name:"Coffee Mug",price:499,icon:"☕",tag:"HOME",desc:"A simple ceramic desk mug."},
{id:7,name:"Notebook",price:299,icon:"📓",tag:"STATIONERY",desc:"Ideas, plans and daily notes."},
{id:8,name:"Sunglasses",price:799,icon:"🕶️",tag:"STYLE",desc:"Classic everyday frames."}];
let cart=JSON.parse(localStorage.getItem("shopCart")||"[]");
const money=n=>"₹"+n.toLocaleString("en-IN");
function renderProducts(){document.getElementById("productCount").textContent=products.length+" products";document.getElementById("products").innerHTML=products.map(p=>`<article class="product"><div class="product-img">${p.icon}</div><div class="tag">${p.tag}</div><h3>${p.name}</h3><p>${p.desc}</p><b>${money(p.price)}</b><button class="buy" onclick="addToCart(${p.id})">Add to Cart</button></article>`).join("")}
function save(){localStorage.setItem("shopCart",JSON.stringify(cart));renderCart()}
function addToCart(id){const x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});save();openCart()}
function change(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<1)cart=cart.filter(i=>i.id!==id);save()}
function removeItem(id){cart=cart.filter(i=>i.id!==id);save()}
function renderCart(){let total=0,count=0;const box=document.getElementById("cartItems");if(!cart.length)box.innerHTML='<div class="empty">🛒<br><br>Your cart is empty.</div>';else box.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);total+=p.price*i.qty;count+=i.qty;return `<div class="cart-row"><div class="mini">${p.icon}</div><div><b>${p.name}</b><div class="qty"><button onclick="change(${p.id},-1)">−</button>${i.qty}<button onclick="change(${p.id},1)">+</button><button class="remove" onclick="removeItem(${p.id})">Remove</button></div></div><strong>${money(p.price*i.qty)}</strong></div>`}).join("");document.getElementById("cartCount").textContent=count;document.getElementById("cartTotal").textContent=money(total)}
function openCart(){document.getElementById("cart").classList.add("open");document.getElementById("overlay").classList.add("show")}
function closeCart(){document.getElementById("cart").classList.remove("open");document.getElementById("overlay").classList.remove("show")}
document.getElementById("cartBtn").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("checkout").onclick=()=>alert(cart.length?"Demo checkout: connect a payment gateway/backend for real orders.":"Your cart is empty.");
renderProducts();renderCart();