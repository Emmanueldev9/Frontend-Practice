let toastTimer;
function showToast(msg, icon) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.innerHTML = '<i class="fas ' + (icon || "fa-check") + '"></i>' + msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    t.classList.remove("show");
  }, 2000);
}

document.querySelectorAll(".p-img").forEach(function (slider) {
  const imgs = slider.querySelectorAll(".p-img-item");
  const box = slider.closest(".product-box");
  let i = 0;
  let timer = null;

  // build one dot per image, placed under the image area
  const dotsWrap = document.createElement("div");
  dotsWrap.className = "p-dots";
  imgs.forEach(function (_, n) {
    const dot = document.createElement("span");
    dot.className = "p-dot" + (n === 0 ? " active" : "");
    dot.addEventListener("click", function () {
      show(n);
    });
    dotsWrap.appendChild(dot);
  });
  box.appendChild(dotsWrap);
  const dots = dotsWrap.querySelectorAll(".p-dot");

  function show(n) {
    imgs[i].classList.remove("active");
    dots[i].classList.remove("active");
    i = (n + imgs.length) % imgs.length;
    imgs[i].classList.add("active");
    dots[i].classList.add("active");
  }

  // hover: auto-cycle through the images
  slider.addEventListener("mouseenter", function () {
    show(i + 1);
    timer = setInterval(function () {
      show(i + 1);
    }, 1000);
  });

  // mouse leaves: stop and reset to image 1
  slider.addEventListener("mouseleave", function () {
    clearInterval(timer);
    show(0);
  });

  // arrows
  slider.querySelector(".p-next").addEventListener("click", function () {
    show(i + 1);
  });
  slider.querySelector(".p-prev").addEventListener("click", function () {
    show(i - 1);
  });
});
document.querySelectorAll(".row-wrapper").forEach(function (wrapper) {
  const row = wrapper.querySelector(".product-row");
  const next = wrapper.querySelector(".row-next");
  const prev = wrapper.querySelector(".row-prev");

  function scrollAmount() {
    const box = row.querySelector(".product-box");
    return box.offsetWidth + 20;
  }

  // grey out an arrow when there is nothing more to scroll to
  function updateArrows() {
    const max = row.scrollWidth - row.clientWidth;
    prev.disabled = row.scrollLeft <= 1;
    next.disabled = row.scrollLeft >= max - 1;
  }

  next.addEventListener("click", function () {
    row.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });

  prev.addEventListener("click", function () {
    row.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });

  row.addEventListener("scroll", updateArrows);
  window.addEventListener("resize", updateArrows);
  window.addEventListener("load", updateArrows);
  updateArrows();
});

(function () {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("zonarCart")) || [];
  } catch (e) {}

  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("cartOverlay");

  function save() {
    try {
      localStorage.setItem("zonarCart", JSON.stringify(cart));
    } catch (e) {}
  }

  function money(n) {
    return "₦" + n.toLocaleString("en-NG");
  }

  function render() {
    // red badge
    const count = cart.reduce(function (s, p) {
      return s + p.qty;
    }, 0);
    countEl.textContent = count;
    countEl.classList.toggle("show", count > 0);

    // cart items
    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      totalEl.textContent = money(0);
      return;
    }

    itemsEl.innerHTML = cart
      .map(function (p, i) {
        return (
          '<div class="cart-item">' +
          '<img src="' +
          p.img +
          '" alt="">' +
          '<div class="cart-item-info">' +
          "<h4>" +
          p.name +
          "</h4>" +
          "<span>" +
          money(p.price) +
          "</span>" +
          '<div class="cart-qty">' +
          '<button type="button" data-act="minus" data-i="' +
          i +
          '">-</button>' +
          "<b>" +
          p.qty +
          "</b>" +
          '<button type="button" data-act="plus" data-i="' +
          i +
          '">+</button>' +
          "</div>" +
          "</div>" +
          '<button class="cart-remove" type="button" data-act="remove" data-i="' +
          i +
          '">&times;</button>' +
          "</div>"
        );
      })
      .join("");

    totalEl.textContent = money(
      cart.reduce(function (s, p) {
        return s + p.price * p.qty;
      }, 0),
    );
  }

  // add a gold button to every product automatically
  document.querySelectorAll(".product-box .p-info").forEach(function (info) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "add-to-cart";
    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    info.appendChild(btn);

    btn.addEventListener("click", function () {
      const box = info.closest(".product-box");
      const name = box.querySelector(".p-name").textContent.trim();
      const price = parseInt(
        box.querySelector(".p-price").textContent.replace(/[^0-9]/g, ""),
        10,
      );
      const img = box.querySelector(".p-img-container img").getAttribute("src");

      const existing = cart.find(function (p) {
        return p.name === name;
      });
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name: name, price: price, img: img, qty: 1 });
      }
      save();
      render();
      showToast("Added to cart");

      // quick feedback on the button
      btn.innerHTML = '<i class="fas fa-check"></i> Added';
      setTimeout(function () {
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
      }, 1000);
    });
  });

  // + / - / remove inside the cart
  itemsEl.addEventListener("click", function (e) {
    const b = e.target.closest("button");
    if (!b) return;
    const i = Number(b.dataset.i);
    if (b.dataset.act === "plus") cart[i].qty++;
    if (b.dataset.act === "minus") cart[i].qty--;
    if (b.dataset.act === "remove" || cart[i].qty <= 0) cart.splice(i, 1);
    save();
    render();
  });

  // open / close the cart
  function openCart() {
    panel.classList.add("open");
    overlay.classList.add("open");
  }
  function closeCart() {
    panel.classList.remove("open");
    overlay.classList.remove("open");
  }

  document.getElementById("cartToggle").addEventListener("click", function (e) {
    e.preventDefault();
    openCart();
  });
  document.getElementById("cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  render();
})();
(function () {
  let favs = [];
  try {
    favs = JSON.parse(localStorage.getItem("zonarFavs")) || [];
  } catch (e) {}

  const countEl = document.getElementById("favCount");
  const itemsEl = document.getElementById("favItems");
  const panel = document.getElementById("favPanel");
  const overlay = document.getElementById("favOverlay");

  function save() {
    try {
      localStorage.setItem("zonarFavs", JSON.stringify(favs));
    } catch (e) {}
  }

  function money(n) {
    return "₦" + n.toLocaleString("en-NG");
  }

  function isFav(name) {
    return favs.some(function (p) {
      return p.name === name;
    });
  }

  // keep every heart button in sync with the saved list
  function syncHearts() {
    document.querySelectorAll(".product-box").forEach(function (box) {
      const name = box.querySelector(".p-name").textContent.trim();
      const btn = box.querySelector(".fav-btn");
      if (btn) btn.classList.toggle("active", isFav(name));
    });
  }

  function render() {
    countEl.textContent = favs.length;
    countEl.classList.toggle("show", favs.length > 0);

    if (favs.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">No favourites yet.</p>';
    } else {
      itemsEl.innerHTML = favs
        .map(function (p, i) {
          return (
            '<div class="cart-item">' +
            '<img src="' +
            p.img +
            '" alt="">' +
            '<div class="cart-item-info">' +
            "<h4>" +
            p.name +
            "</h4>" +
            "<span>" +
            money(p.price) +
            "</span><br>" +
            '<button class="fav-add" type="button" data-act="tocart" data-i="' +
            i +
            '">Add to Cart</button>' +
            "</div>" +
            '<button class="cart-remove" type="button" data-act="remove" data-i="' +
            i +
            '">&times;</button>' +
            "</div>"
          );
        })
        .join("");
    }
    syncHearts();
  }

  // add a heart button to every product image automatically
  document.querySelectorAll(".product-box").forEach(function (box) {
    const container = box.querySelector(".p-img-container");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fav-btn";
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    container.appendChild(btn);

    btn.addEventListener("click", function () {
      const name = box.querySelector(".p-name").textContent.trim();
      const price = parseInt(
        box.querySelector(".p-price").textContent.replace(/[^0-9]/g, ""),
        10,
      );
      const img = box.querySelector(".p-img-container img").getAttribute("src");

      if (isFav(name)) {
        favs = favs.filter(function (p) {
          return p.name !== name;
        });
        showToast("Removed from favourites", "fa-heart-broken");
      } else {
        favs.push({ name: name, price: price, img: img });
        showToast("Added to favourites", "fa-heart");
      }
      save();
      render();
    });
  });

  // inside the favourites panel: remove, or move an item to the cart
  itemsEl.addEventListener("click", function (e) {
    const b = e.target.closest("button");
    if (!b) return;
    const i = Number(b.dataset.i);

    if (b.dataset.act === "tocart") {
      const name = favs[i].name;
      document.querySelectorAll(".product-box").forEach(function (box) {
        if (box.querySelector(".p-name").textContent.trim() === name) {
          const add = box.querySelector(".add-to-cart");
          if (add) {
            add.click();
          }
        }
      });
      return;
    }

    if (b.dataset.act === "remove") {
      favs.splice(i, 1);
      save();
      render();
    }
  });

  function openFav() {
    panel.classList.add("open");
    overlay.classList.add("open");
  }
  function closeFav() {
    panel.classList.remove("open");
    overlay.classList.remove("open");
  }

  document.getElementById("favToggle").addEventListener("click", function (e) {
    e.preventDefault();
    openFav();
  });
  document.getElementById("favClose").addEventListener("click", closeFav);
  overlay.addEventListener("click", closeFav);

  render();
})();
(function () {
  // sample reviews: replace with real customer reviews
  const defaults = [
    {
      name: "Geroge Bennet",
      product: "Urban Edge",
      cat: "men",
      img: "images/urban.1.jpg",
      rating: 5,
      meta: "Verified buyer · Lagos",
      text: "The fit is perfect and the cotton feels premium. I get compliments every time I wear it.",
    },
    {
      name: "Amaka Nwosu",
      product: "Emerald Royalty",
      cat: "women",
      img: "images/women-1.jpg",
      rating: 5,
      meta: "Verified buyer · Abuja",
      text: "Flowy, flattering and exactly like the pictures. Delivery was quick too.",
    },
    {
      name: "Tunde Bakare",
      product: "Casio Edifice",
      cat: "watches",
      img: "images/CasioEdifice.1.jpg",
      rating: 4.5,
      meta: "Verified buyer · Ibadan",
      text: "Solid steel, smooth chronograph and it looks far more expensive than it is.",
    },
    {
      name: "Ngozi Okonkwo",
      product: "Floral Romance",
      cat: "women",
      img: "images/women-2.jpg",
      rating: 4,
      meta: "Verified buyer · Port Harcourt",
      text: "Beautifully tailored top and skirt. I would size up if you prefer a looser fit.",
    },
    {
      name: "Emeka Nwosu",
      product: "Effortless Class",
      cat: "men",
      img: "images/class-1.jpg",
      rating: 5,
      meta: "Verified buyer · Enugu",
      text: "Smart casual done right. I wore it to the office and a dinner on the same day.",
    },
    {
      name: "Seyi Ogunleye",
      product: "Invicta Pro Driver",
      cat: "watches",
      img: "images/Invicta.2.jpg",
      rating: 5,
      meta: "Verified buyer · Lagos",
      text: "The Silver tone is rich without being loud. The leather strap is very comfortable.",
    },
    {
      name: "Folake Williams",
      product: "Chocolate Glam",
      cat: "women",
      img: "images/women-12.jpg",
      rating: 5,
      meta: "Verified buyer · Lagos",
      text: "I wore it to a wedding and felt unstoppable. The stitching is flawless.",
    },
    {
      name: "Ahmed",
      product: "Comfort Mode",
      cat: "men",
      img: "images/comfort-1.jpg",
      rating: 4,
      meta: "Verified buyer · Kano",
      text: "Soft, relaxed and great for everyday wear. It holds its shape after washing.",
    },
    {
      name: "Kelechi",
      product: "Casio G-Shock",
      cat: "watches",
      img: "images/g-shock.2.jpg",
      rating: 4.5,
      meta: "Verified buyer · Owerri",
      text: "Heavy, reliable and the rotating bezel feels satisfying. Great value for the price.",
    },
  ];

  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem("zonarReviews")) || [];
  } catch (e) {}
  let reviews = saved.concat(defaults);

  const row = document.getElementById("reviewRow");
  const prev = document.querySelector(".rev-prev");
  const next = document.querySelector(".rev-next");
  const filters = document.getElementById("revFilters");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c];
    });
  }

  // full, half and empty stars using Font Awesome
  function starsHTML(rating) {
    const v = Math.round(rating * 2) / 2;
    const full = Math.floor(v);
    const half = v % 1 !== 0;
    let h = "";
    for (let i = 0; i < 5; i++) {
      if (i < full) h += '<i class="fas fa-star"></i>';
      else if (i === full && half) h += '<i class="fas fa-star-half-alt"></i>';
      else h += '<i class="far fa-star"></i>';
    }
    return h;
  }

  function cardHTML(r) {
    return (
      '<div class="review-card" data-cat="' +
      esc(r.cat) +
      '">' +
      '<i class="fas fa-quote-right quote-mark"></i>' +
      '<div class="stars">' +
      starsHTML(r.rating) +
      "</div>" +
      '<p class="review-text">' +
      esc(r.text) +
      "</p>" +
      '<div class="review-product">' +
      '<img src="' +
      esc(r.img) +
      '" alt="">' +
      "<div><small>Purchased</small><h5>" +
      esc(r.product) +
      "</h5></div>" +
      "</div>" +
      '<div class="reviewer">' +
      '<div class="avatar">' +
      esc(r.name.charAt(0).toUpperCase()) +
      "</div>" +
      "<div><h4>" +
      esc(r.name) +
      "</h4><span>" +
      esc(r.meta) +
      "</span></div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderSummary() {
    const total = reviews.length;
    const avg = total
      ? reviews.reduce(function (s, r) {
          return s + r.rating;
        }, 0) / total
      : 0;
    document.getElementById("avgScore").textContent = avg.toFixed(1);
    document.getElementById("avgStars").innerHTML = starsHTML(avg);
    document.getElementById("totalReviews").textContent =
      "Based on " + total + " review" + (total === 1 ? "" : "s");

    let bars = "";
    for (let n = 5; n >= 1; n--) {
      const count = reviews.filter(function (r) {
        return Math.round(r.rating) === n;
      }).length;
      const pct = total ? Math.round((count / total) * 100) : 0;
      bars +=
        '<div class="bar-line"><span>' +
        n +
        ' <i class="fas fa-star"></i></span>' +
        '<div class="bar"><div class="bar-fill" style="width:' +
        pct +
        '%"></div></div>' +
        "<span>" +
        count +
        "</span></div>";
    }
    document.getElementById("rsBars").innerHTML = bars;
  }

  function updateArrows() {
    const max = row.scrollWidth - row.clientWidth;
    prev.disabled = row.scrollLeft <= 1;
    next.disabled = row.scrollLeft >= max - 1;
  }

  function scrollAmount() {
    const card = Array.from(row.children).find(function (c) {
      return c.offsetWidth;
    });
    return card ? card.offsetWidth + 20 : 300;
  }

  function applyFilter(type) {
    row.querySelectorAll(".review-card").forEach(function (c) {
      c.style.display = type === "all" || c.dataset.cat === type ? "" : "none";
    });
    row.scrollLeft = 0;
    updateArrows();
  }

  function renderAll() {
    row.innerHTML = reviews.map(cardHTML).join("");
    renderSummary();
    const active = filters.querySelector(".active");
    applyFilter(active ? active.dataset.filter : "all");
  }

  // slider arrows
  next.addEventListener("click", function () {
    row.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
  prev.addEventListener("click", function () {
    row.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });
  row.addEventListener("scroll", updateArrows);
  window.addEventListener("resize", updateArrows);
  window.addEventListener("load", updateArrows);

  // filter tabs
  filters.addEventListener("click", function (e) {
    const b = e.target.closest(".rev-filter");
    if (!b) return;
    filters.querySelectorAll(".rev-filter").forEach(function (x) {
      x.classList.remove("active");
    });
    b.classList.add("active");
    applyFilter(b.dataset.filter);
  });

  // ----- write a review popup -----
  const modal = document.getElementById("revModal");
  const overlay = document.getElementById("revOverlay");
  const form = document.getElementById("revForm");
  const errEl = document.getElementById("revError");
  const picker = document.getElementById("starPicker");
  let picked = 0;

  for (let i = 1; i <= 5; i++) {
    const s = document.createElement("i");
    s.className = "far fa-star";
    s.dataset.v = i;
    picker.appendChild(s);
  }
  function paint(n) {
    picker.querySelectorAll("i").forEach(function (s) {
      s.className = (Number(s.dataset.v) <= n ? "fas" : "far") + " fa-star";
    });
  }
  picker.addEventListener("mouseover", function (e) {
    if (e.target.dataset.v) paint(Number(e.target.dataset.v));
  });
  picker.addEventListener("mouseleave", function () {
    paint(picked);
  });
  picker.addEventListener("click", function (e) {
    if (e.target.dataset.v) {
      picked = Number(e.target.dataset.v);
      paint(picked);
    }
  });

  // the product list is read from your real products on the page
  function loadProducts() {
    const sel = document.getElementById("revProduct");
    sel.innerHTML = '<option value="">Choose a product</option>';
    document.querySelectorAll(".product-box").forEach(function (box) {
      const name = box.querySelector(".p-name").textContent.trim();
      const o = document.createElement("option");
      o.value = name;
      o.textContent = name;
      sel.appendChild(o);
    });
  }

  function openModal() {
    loadProducts();
    modal.classList.add("open");
    overlay.classList.add("open");
  }
  function closeModal() {
    modal.classList.remove("open");
    overlay.classList.remove("open");
  }
  document.getElementById("openReview").addEventListener("click", openModal);
  document.getElementById("revClose").addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("revName").value.trim();
    const product = document.getElementById("revProduct").value;
    const text = document.getElementById("revText").value.trim();

    if (!name || !product || !picked || text.length < 10) {
      errEl.textContent =
        "Please add your name, a product, a star rating and at least 10 characters.";
      return;
    }

    // find the product to get its picture and category
    let img = "";
    let cat = "men";
    document.querySelectorAll(".product-box").forEach(function (box) {
      if (box.querySelector(".p-name").textContent.trim() === product && !img) {
        img = box.querySelector(".p-img-container img").getAttribute("src");
        const slider = box.closest(".p-slider");
        if (slider && slider.classList.contains("women-slider")) cat = "women";
        if (slider && slider.classList.contains("watches-slider"))
          cat = "watches";
      }
    });

    saved.unshift({
      name: name,
      product: product,
      cat: cat,
      img: img,
      rating: picked,
      text: text,
      meta:
        "Customer review · " +
        new Date().toLocaleDateString("en-NG", {
          month: "short",
          year: "numeric",
        }),
    });
    try {
      localStorage.setItem("zonarReviews", JSON.stringify(saved));
    } catch (err) {}
    reviews = saved.concat(defaults);

    // reset and show the new review first
    form.reset();
    picked = 0;
    paint(0);
    errEl.textContent = "";
    closeModal();
    filters.querySelectorAll(".rev-filter").forEach(function (x) {
      x.classList.toggle("active", x.dataset.filter === "all");
    });
    renderAll();
    showToast("Thank you for your review");
  });

  renderAll();
})();
(function () {
  // current year
  document.getElementById("year").textContent = new Date().getFullYear();

  // back to top
  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("show", window.scrollY > 500);
  });
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // newsletter
  const form = document.getElementById("newsForm");
  const input = document.getElementById("newsEmail");
  const msg = document.getElementById("newsMsg");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = input.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    if (!valid) {
      msg.textContent = "Please enter a valid email address.";
      msg.className = "news-msg error";
      return;
    }

    let list = [];
    try {
      list = JSON.parse(localStorage.getItem("zonarNews")) || [];
    } catch (err) {}

    if (list.indexOf(email) !== -1) {
      msg.textContent = "You are already on the list.";
      msg.className = "news-msg error";
      return;
    }

    list.push(email);
    try {
      localStorage.setItem("zonarNews", JSON.stringify(list));
    } catch (err) {}

    form.reset();
    msg.textContent = "";
    showToast("Subscribed successfully");
  });

  input.addEventListener("input", function () {
    msg.textContent = "";
  });
})();
