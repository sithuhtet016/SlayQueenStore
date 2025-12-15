import { Navbar } from "~/components/Navbar";
import { useCallback, useEffect, useMemo, useState } from "react";
import productsData from "../../public/data/products.json";
import { useCart } from "~/cart-context";
const uploadIcon = "/assets/icons/image-regular-full.svg";
const checkboxUnchecked = "/assets/icons/square-check-regular-full.svg";
const checkboxChecked = "/assets/icons/square-check-solid-full.svg";
const closeIcon = "/assets/icons/xmark-solid-full.svg";
const whatsappIcon = "/assets/icons/whatsapp-brands-solid-full.svg";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const products = productsData as Array<{
    id: number;
    name: string;
    price: number;
    currency: string;
    sku?: string;
    variants?: Array<{ id: number; name?: string }>;
  }>;

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  }, [items, products]);

  const displayCurrency = useMemo(() => {
    const firstProduct = products.find((p) =>
      items.some((i) => i.productId === p.id)
    );
    return firstProduct?.currency || "AED";
  }, [items, products]);

  const formatCurrency = useCallback(
    (amount: number) => {
      if (!amount) return `${displayCurrency} 0`;
      try {
        return new Intl.NumberFormat("en-AE", {
          style: "currency",
          currency: displayCurrency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      } catch (_e) {
        return `${displayCurrency} ${amount}`;
      }
    },
    [displayCurrency]
  );

  const lineItemsSummary = useMemo(() => {
    const lines = items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        const variant = product.variants?.find((v) => v.id === item.variantId);

        const labelParts = [
          product.name,
          variant?.name ? `(${variant.name})` : null,
          product.sku ? `SKU: ${product.sku}` : null,
        ].filter(Boolean);

        const unitPrice = product.price;
        const subtotal = unitPrice * item.quantity;

        return `${labelParts.join(" ")} — Qty ${item.quantity} — Unit ${formatCurrency(
          unitPrice
        )} — Subtotal ${formatCurrency(subtotal)}`;
      })
      .filter(Boolean);

    return lines.join("\n");
  }, [items, products, formatCurrency]);

  const [fileName, setFileName] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function saveOrderToLocalStorage() {
    if (typeof window === "undefined") return;
    try {
      const order = {
        id: Date.now(),
        items,
        total,
        currency: displayCurrency,
        lineItemsSummary,
        createdAt: new Date().toISOString(),
      } as const;

      const existing = JSON.parse(
        window.localStorage.getItem("orders") || "[]"
      ) as Array<any>;
      existing.unshift(order);
      window.localStorage.setItem("orders", JSON.stringify(existing));
    } catch (_e) {
      // ignore storage failures
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowErrors(true);
    const form = e.currentTarget;

    if (form.checkValidity()) {
      setIsSubmitting(true);
      const formData = new FormData(form);

      try {
        const response = await fetch(
          "https://formsubmit.co/sithuhtet016@gmail.com",
          {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          // persist the order for user to review later
          saveOrderToLocalStorage();
          // clear cart and show success state
          clearCart();
          setIsSuccess(true);
          form.reset();
          setFileName(null);
          setIsChecked(false);
          setShowErrors(false);
        } else {
          const data = await response.json().catch(() => null);
          if (data && data.errors) {
            alert(data.errors.map((err: any) => err.message).join("\n"));
          } else {
            alert("There was a problem submitting your form");
          }
        }
      } catch (error) {
        alert("There was a problem submitting your form");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSuccess) {
    return (
      <div className="min-w-[402px]">
        <Navbar />
        <div className="h-[calc(100vh-72px)] mt-[72px] flex items-center justify-center">
          <div className="max-w-[370px] h-[330px] w-full flex flex-col bg-white px-4 py-5 text-center relative rounded-sm">
            <div className="flex-1 flex flex-col justify-center items-center">
              <h2 className="text-[20px] font-bold text-[#3D2645] mb-4">
                Order Confirmed!
              </h2>
              <p className="text-[#2B2520] font-bold text-[16px] mb-8">
                Thank you for your order. We have received your payment proof
                and will process your order shortly.
              </p>
              <a
                href="https://wa.me/971559367466"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#6B9E5E] font-bold text-[12px] text-[#3D2645] px-5 py-3 rounded-lg hover:bg-[#5a854f] transition-colors flex items-center gap-2"
              >
                Chat with us on WhatsApp
                <span>
                  <img className="w-[18px]" src={whatsappIcon} alt="WhatsApp" />
                </span>
              </a>
              <button
                onClick={() => {
                  clearCart();
                  window.location.href = "/categories";
                }}
                className="absolute top-5 right-5 z-50 text-[#3D2645] hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <img src={closeIcon} alt="Close" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[402px] mt-[72px] px-4 md:px-7 py-6 md:py-9">
      <Navbar />
      <h1 className="lg:max-w-3xl lg:mx-auto uppercase text-[28px] font-bold text-[#3D2645] mb-5">
        Checkout
      </h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        encType="multipart/form-data"
        action="https://formsubmit.co/sithuhtet016@gmail.com"
        method="POST"
        className={`mx-auto max-w-[402px] md:max-w-3xl group ${
          showErrors ? "show-errors" : ""
        }`}
      >
        {/* FormSubmit.co Configuration */}
        <input
          type="hidden"
          name="_subject"
          value="New Order from Slay Queen Store"
        />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="false" />
        <input
          type="hidden"
          name="cart_items"
          value={lineItemsSummary || "No items in cart"}
        />
        <input type="hidden" name="cart_total" value={formatCurrency(total)} />
        <input type="hidden" name="cart_currency" value={displayCurrency} />

        <div>
          <label
            htmlFor="email"
            className="block font-lato text-[16px] text-[#3D2645] font-semibold mb-3"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="peer placeholder:font-lato placeholder:font-normal placeholder:text-[12px] w-full border bg-white border-white rounded px-3 py-2 focus:border-[#D4AF37] focus:border-2 outline-none transition font-lato text-[14px] text-[#3D2645] group-[.show-errors]:invalid:border-red-500 group-[.show-errors]:invalid:border-2"
            placeholder="your@email.com"
            required
          />
          <span className="hidden group-[.show-errors]:peer-[:not(:placeholder-shown)]:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1">
            Please enter a valid email address
          </span>
          <span className="hidden group-[.show-errors]:peer-placeholder-shown:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1">
            Email is required
          </span>
        </div>
        <h4 className="my-6 font-lato text-[16px] text-[#3D2645] font-semibold">
          Shipping Address
        </h4>
        <div className="mb-6">
          <label
            className="block font-lato text-[14px] text-[#3D2645] font-semibold mb-3"
            htmlFor="name"
          >
            Full Name
          </label>
          <input
            className="peer placeholder:font-lato placeholder:font-normal placeholder:text-[12px] w-full border bg-white border-white rounded px-3 py-2 focus:border-[#D4AF37] focus:border-2 outline-none transition mb-3 font-lato text-[14px] text-[#3D2645] group-[.show-errors]:invalid:border-red-500 group-[.show-errors]:invalid:border-2"
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            required
          />
          <span className="hidden group-[.show-errors]:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1 mb-3">
            First Name is required
          </span>
          <input
            className="peer placeholder:font-lato placeholder:font-normal placeholder:text-[12px] w-full border bg-white border-white rounded px-3 py-2 focus:border-[#D4AF37] focus:border-2 outline-none transition font-lato text-[14px] text-[#3D2645] group-[.show-errors]:invalid:border-red-500 group-[.show-errors]:invalid:border-2"
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            required
          />
          <span className="hidden group-[.show-errors]:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1">
            Last Name is required
          </span>
        </div>
        <div className="mb-6">
          <label
            className="block font-lato text-[14px] text-[#3D2645] font-semibold mb-3"
            htmlFor="streetAddress"
          >
            Street
          </label>
          <input
            className="peer placeholder:font-lato placeholder:font-normal placeholder:text-[12px] w-full border bg-white border-white rounded px-3 py-2 focus:border-[#D4AF37] focus:border-2 outline-none transition font-lato text-[14px] text-[#3D2645] group-[.show-errors]:invalid:border-red-500 group-[.show-errors]:invalid:border-2"
            type="text"
            name="streetAddress"
            id="streetAddress"
            placeholder="1234 Main St"
            required
          />
          <span className="hidden group-[.show-errors]:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1">
            Street Address is required
          </span>
        </div>
        <div className="mb-6">
          <label
            className="block font-lato text-[14px] text-[#3D2645] font-semibold mb-3"
            htmlFor="building"
          >
            Building name/no
          </label>
          <input
            className="peer placeholder:font-lato placeholder:font-normal placeholder:text-[12px] w-full border bg-white border-white rounded px-3 py-2 focus:border-[#D4AF37] focus:border-2 outline-none transition mb-3 font-lato text-[14px] text-[#3D2645] group-[.show-errors]:invalid:border-red-500 group-[.show-errors]:invalid:border-2"
            type="text"
            name="building"
            id="building"
            placeholder="Building name/no"
            required
          />
          <span className="hidden group-[.show-errors]:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1 mb-3">
            Building name/no is required
          </span>
        </div>
        <div className="mb-6">
          <label
            className="block font-lato text-[14px] text-[#3D2645] font-semibold mb-3"
            htmlFor="city"
          >
            City
          </label>
          <input
            className="peer placeholder:font-lato placeholder:font-normal placeholder:text-[12px] w-full border bg-white border-white rounded px-3 py-2 focus:border-[#D4AF37] focus:border-2 outline-none transition font-lato text-[14px] text-[#3D2645] group-[.show-errors]:invalid:border-red-500 group-[.show-errors]:invalid:border-2"
            type="text"
            name="city"
            id="city"
            placeholder="City"
            required
          />
          <span className="hidden group-[.show-errors]:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1">
            City is required
          </span>
        </div>
        <div className="mb-6">
          <label
            className="block font-lato text-[14px] text-[#3D2645] font-semibold mb-3"
            htmlFor="country"
          >
            Country
          </label>
          <div className="relative">
            <select
              id="country"
              name="country"
              required
              className="peer appearance-none w-full border bg-white border-white rounded px-3 py-2 pr-8 focus:border-[#D4AF37] focus:border-2 outline-none transition font-lato text-[14px] text-[#3D2645] group-[.show-errors]:invalid:border-red-500 group-[.show-errors]:invalid:border-2"
              defaultValue=""
            >
              <option value="" disabled className="text-gray-400">
                Select Country
              </option>
              <option value="AF">Afghanistan</option>
              <option value="AX">Åland Islands</option>
              <option value="AL">Albania</option>
              <option value="DZ">Algeria</option>
              <option value="AS">American Samoa</option>
              <option value="AD">Andorra</option>
              <option value="AO">Angola</option>
              <option value="AI">Anguilla</option>
              <option value="AQ">Antarctica</option>
              <option value="AG">Antigua and Barbuda</option>
              <option value="AR">Argentina</option>
              <option value="AM">Armenia</option>
              <option value="AW">Aruba</option>
              <option value="AU">Australia</option>
              <option value="AT">Austria</option>
              <option value="AZ">Azerbaijan</option>
              <option value="BS">Bahamas</option>
              <option value="BH">Bahrain</option>
              <option value="BD">Bangladesh</option>
              <option value="BB">Barbados</option>
              <option value="BY">Belarus</option>
              <option value="BE">Belgium</option>
              <option value="BZ">Belize</option>
              <option value="BJ">Benin</option>
              <option value="BM">Bermuda</option>
              <option value="BT">Bhutan</option>
              <option value="BO">Bolivia</option>
              <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
              <option value="BA">Bosnia and Herzegovina</option>
              <option value="BW">Botswana</option>
              <option value="BV">Bouvet Island</option>
              <option value="BR">Brazil</option>
              <option value="IO">British Indian Ocean Territory</option>
              <option value="VG">British Virgin Islands</option>
              <option value="BN">Brunei</option>
              <option value="BG">Bulgaria</option>
              <option value="BF">Burkina Faso</option>
              <option value="BI">Burundi</option>
              <option value="KH">Cambodia</option>
              <option value="CM">Cameroon</option>
              <option value="CA">Canada</option>
              <option value="CV">Cape Verde</option>
              <option value="KY">Cayman Islands</option>
              <option value="CF">Central African Republic</option>
              <option value="TD">Chad</option>
              <option value="CL">Chile</option>
              <option value="CN">China</option>
              <option value="CX">Christmas Island</option>
              <option value="CC">Cocos (Keeling) Islands</option>
              <option value="CO">Colombia</option>
              <option value="KM">Comoros</option>
              <option value="CG">Congo</option>
              <option value="CD">Congo, Democratic Republic of the</option>
              <option value="CK">Cook Islands</option>
              <option value="CR">Costa Rica</option>
              <option value="CI">Côte d'Ivoire</option>
              <option value="HR">Croatia</option>
              <option value="CU">Cuba</option>
              <option value="CW">Curaçao</option>
              <option value="CY">Cyprus</option>
              <option value="CZ">Czechia</option>
              <option value="DK">Denmark</option>
              <option value="DJ">Djibouti</option>
              <option value="DM">Dominica</option>
              <option value="DO">Dominican Republic</option>
              <option value="EC">Ecuador</option>
              <option value="EG">Egypt</option>
              <option value="SV">El Salvador</option>
              <option value="GQ">Equatorial Guinea</option>
              <option value="ER">Eritrea</option>
              <option value="EE">Estonia</option>
              <option value="ET">Ethiopia</option>
              <option value="FK">Falkland Islands (Malvinas)</option>
              <option value="FO">Faroe Islands</option>
              <option value="FJ">Fiji</option>
              <option value="FI">Finland</option>
              <option value="FR">France</option>
              <option value="GF">French Guiana</option>
              <option value="PF">French Polynesia</option>
              <option value="TF">French Southern Territories</option>
              <option value="GA">Gabon</option>
              <option value="GM">Gambia</option>
              <option value="GE">Georgia</option>
              <option value="DE">Germany</option>
              <option value="GH">Ghana</option>
              <option value="GI">Gibraltar</option>
              <option value="GR">Greece</option>
              <option value="GL">Greenland</option>
              <option value="GD">Grenada</option>
              <option value="GP">Guadeloupe</option>
              <option value="GU">Guam</option>
              <option value="GT">Guatemala</option>
              <option value="GG">Guernsey</option>
              <option value="GN">Guinea</option>
              <option value="GW">Guinea-Bissau</option>
              <option value="GY">Guyana</option>
              <option value="HT">Haiti</option>
              <option value="HM">Heard Island and McDonald Islands</option>
              <option value="VA">Holy See (Vatican City State)</option>
              <option value="HN">Honduras</option>
              <option value="HK">Hong Kong</option>
              <option value="HU">Hungary</option>
              <option value="IS">Iceland</option>
              <option value="IN">India</option>
              <option value="ID">Indonesia</option>
              <option value="IR">Iran</option>
              <option value="IQ">Iraq</option>
              <option value="IE">Ireland</option>
              <option value="IM">Isle of Man</option>
              <option value="IL">Israel</option>
              <option value="IT">Italy</option>
              <option value="JM">Jamaica</option>
              <option value="JP">Japan</option>
              <option value="JE">Jersey</option>
              <option value="JO">Jordan</option>
              <option value="KZ">Kazakhstan</option>
              <option value="KE">Kenya</option>
              <option value="KI">Kiribati</option>
              <option value="KW">Kuwait</option>
              <option value="KG">Kyrgyzstan</option>
              <option value="LA">Laos</option>
              <option value="LV">Latvia</option>
              <option value="LB">Lebanon</option>
              <option value="LS">Lesotho</option>
              <option value="LR">Liberia</option>
              <option value="LY">Libya</option>
              <option value="LI">Liechtenstein</option>
              <option value="LT">Lithuania</option>
              <option value="LU">Luxembourg</option>
              <option value="MO">Macao</option>
              <option value="MG">Madagascar</option>
              <option value="MW">Malawi</option>
              <option value="MY">Malaysia</option>
              <option value="MV">Maldives</option>
              <option value="ML">Mali</option>
              <option value="MT">Malta</option>
              <option value="MH">Marshall Islands</option>
              <option value="MQ">Martinique</option>
              <option value="MR">Mauritania</option>
              <option value="MU">Mauritius</option>
              <option value="YT">Mayotte</option>
              <option value="MX">Mexico</option>
              <option value="FM">Micronesia</option>
              <option value="MD">Moldova</option>
              <option value="MC">Monaco</option>
              <option value="MN">Mongolia</option>
              <option value="ME">Montenegro</option>
              <option value="MS">Montserrat</option>
              <option value="MA">Morocco</option>
              <option value="MZ">Mozambique</option>
              <option value="MM">Myanmar</option>
              <option value="NA">Namibia</option>
              <option value="NR">Nauru</option>
              <option value="NP">Nepal</option>
              <option value="NL">Netherlands</option>
              <option value="NC">New Caledonia</option>
              <option value="NZ">New Zealand</option>
              <option value="NI">Nicaragua</option>
              <option value="NE">Niger</option>
              <option value="NG">Nigeria</option>
              <option value="NU">Niue</option>
              <option value="NF">Norfolk Island</option>
              <option value="KP">North Korea</option>
              <option value="MK">North Macedonia</option>
              <option value="MP">Northern Mariana Islands</option>
              <option value="NO">Norway</option>
              <option value="OM">Oman</option>
              <option value="PK">Pakistan</option>
              <option value="PW">Palau</option>
              <option value="PS">Palestine</option>
              <option value="PA">Panama</option>
              <option value="PG">Papua New Guinea</option>
              <option value="PY">Paraguay</option>
              <option value="PE">Peru</option>
              <option value="PH">Philippines</option>
              <option value="PN">Pitcairn</option>
              <option value="PL">Poland</option>
              <option value="PT">Portugal</option>
              <option value="PR">Puerto Rico</option>
              <option value="QA">Qatar</option>
              <option value="RE">Réunion</option>
              <option value="RO">Romania</option>
              <option value="RU">Russia</option>
              <option value="RW">Rwanda</option>
              <option value="BL">Saint Barthélemy</option>
              <option value="SH">
                Saint Helena, Ascension and Tristan da Cunha
              </option>
              <option value="KN">Saint Kitts and Nevis</option>
              <option value="LC">Saint Lucia</option>
              <option value="MF">Saint Martin (French part)</option>
              <option value="PM">Saint Pierre and Miquelon</option>
              <option value="VC">Saint Vincent and the Grenadines</option>
              <option value="WS">Samoa</option>
              <option value="SM">San Marino</option>
              <option value="ST">Sao Tome and Principe</option>
              <option value="SA">Saudi Arabia</option>
              <option value="SN">Senegal</option>
              <option value="RS">Serbia</option>
              <option value="SC">Seychelles</option>
              <option value="SL">Sierra Leone</option>
              <option value="SG">Singapore</option>
              <option value="SX">Sint Maarten (Dutch part)</option>
              <option value="SK">Slovakia</option>
              <option value="SI">Slovenia</option>
              <option value="SB">Solomon Islands</option>
              <option value="SO">Somalia</option>
              <option value="ZA">South Africa</option>
              <option value="GS">
                South Georgia and the South Sandwich Islands
              </option>
              <option value="KR">South Korea</option>
              <option value="SS">South Sudan</option>
              <option value="ES">Spain</option>
              <option value="LK">Sri Lanka</option>
              <option value="SD">Sudan</option>
              <option value="SR">Suriname</option>
              <option value="SJ">Svalbard and Jan Mayen</option>
              <option value="SE">Sweden</option>
              <option value="CH">Switzerland</option>
              <option value="SY">Syria</option>
              <option value="TW">Taiwan</option>
              <option value="TJ">Tajikistan</option>
              <option value="TZ">Tanzania</option>
              <option value="TH">Thailand</option>
              <option value="TL">Timor-Leste</option>
              <option value="TG">Togo</option>
              <option value="TK">Tokelau</option>
              <option value="TO">Tonga</option>
              <option value="TT">Trinidad and Tobago</option>
              <option value="TN">Tunisia</option>
              <option value="TR">Turkey</option>
              <option value="TM">Turkmenistan</option>
              <option value="TC">Turks and Caicos Islands</option>
              <option value="TV">Tuvalu</option>
              <option value="VI">U.S. Virgin Islands</option>
              <option value="UG">Uganda</option>
              <option value="UA">Ukraine</option>
              <option value="AE">United Arab Emirates</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="UM">United States Minor Outlying Islands</option>
              <option value="UY">Uruguay</option>
              <option value="UZ">Uzbekistan</option>
              <option value="VU">Vanuatu</option>
              <option value="VE">Venezuela</option>
              <option value="VN">Vietnam</option>
              <option value="WF">Wallis and Futuna</option>
              <option value="EH">Western Sahara</option>
              <option value="YE">Yemen</option>
              <option value="ZM">Zambia</option>
              <option value="ZW">Zimbabwe</option>
              <option value="other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#3D2645]">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
            <span className="hidden group-[.show-errors]:peer-invalid:block absolute -bottom-5 left-0 text-red-500 text-[10px] font-lato font-semibold">
              Country is required
            </span>
          </div>
        </div>
        <div>
          <label
            className="block font-lato text-[14px] text-[#3D2645] font-semibold mb-3"
            htmlFor="phoneNumber"
          >
            Phone Number
          </label>
          <input
            className="peer placeholder:font-lato placeholder:font-normal placeholder:text-[12px] w-full border bg-white border-white rounded px-3 py-2 focus:border-[#D4AF37] focus:border-2 outline-none transition font-lato text-[14px] text-[#3D2645] group-[.show-errors]:invalid:border-red-500 group-[.show-errors]:invalid:border-2"
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            placeholder="+971 55 567 8900"
            required
            pattern="^[\d\+\-\s]+$"
            minLength={10}
          />
          <span className="hidden group-[.show-errors]:peer-[:not(:placeholder-shown)]:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1">
            Please enter a valid phone number
          </span>
          <span className="hidden group-[.show-errors]:peer-placeholder-shown:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1">
            Phone Number is required
          </span>
        </div>
        <h4 className="font-lato font-bold text-[16px] text-[#3D2645] my-6">
          Direct Bank Transfer
        </h4>
        <div>
          <h5 className="font-lato font-semibold text-[14px] text-[#3D2645] mb-3">
            Account Holder Name
          </h5>
          <p className="font-lato font-normal text-[12px] text-[#2B2520] mb-6">
            MIN KHANT MAUNG
          </p>
        </div>
        <div>
          <h5 className="font-lato font-semibold text-[14px] text-[#3D2645] mb-3">
            Bank Name
          </h5>
          <p className="font-lato font-normal text-[12px] text-[#2B2520] mb-6">
            Mashreq Bank
          </p>
        </div>
        <div>
          <h5 className="font-lato font-semibold text-[14px] text-[#3D2645] mb-3">
            Account Number
          </h5>
          <p className="font-lato font-normal text-[12px] text-[#2B2520] mb-6">
            019101474289
          </p>
        </div>
        <div>
          <h5 className="font-lato font-semibold text-[14px] text-[#3D2645] mb-3">
            IBAN Number
          </h5>
          <p className="font-lato font-normal text-[12px] text-[#2B2520] mb-6">
            AE660330000019101474289
          </p>
        </div>
        <div>
          <h5 className="font-lato font-semibold text-[14px] text-[#3D2645] mb-3">
            Amount to Transfer
          </h5>
          <p className="font-lato font-normal text-[12px] text-[#2B2520] mb-6">
            {formatCurrency(total)}
          </p>
        </div>
        <div>
          <h5 className="block font-lato text-[14px] text-[#3D2645] font-semibold mb-3">
            Upload Payment Proof
          </h5>
          <input
            type="file"
            name="paymentProof"
            id="paymentProof"
            onChange={(e) =>
              setFileName(e.currentTarget.files?.[0]?.name || null)
            }
            className="hidden peer"
            required
          />
          <label
            htmlFor="paymentProof"
            className="flex items-center justify-center w-full h-[94px] border border-dashed border-[#3D2645] rounded-md cursor-pointer bg-white hover:bg-gray-50 transition group-[.show-errors]:peer-invalid:border-red-500"
          >
            {fileName ? (
              <span className="text-sm font-semibold text-[#2B2520]">
                Change File
              </span>
            ) : (
              <div className="flex flex-col items-center text-center">
                <img className="w-5 mb-1" src={uploadIcon} alt="Upload Icon" />
                <p className="font-lato font-semibold text-[10px] text-[#2B2520] leading-5">
                  Upload your screenshot or drag and drop <br /> JPG, PNG, PDF
                  (max 5MB)
                </p>
              </div>
            )}
          </label>
          {fileName && (
            <p className="mt-3 font-lato text-[12px] font-semibold text-[#2B2520] text-center">
              {fileName}
            </p>
          )}
          <span className="hidden group-[.show-errors]:peer-invalid:block text-red-500 text-[10px] font-lato font-semibold mt-1 text-center">
            Payment Proof is required
          </span>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <input
            type="checkbox"
            name="completedTransfer"
            id="completedTransfer"
            required
            className="hidden peer"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="completedTransfer" className="cursor-pointer">
            <img
              src={isChecked ? checkboxChecked : checkboxUnchecked}
              alt="Checkbox"
              className="w-5 group-[.show-errors]:peer-invalid:border group-[.show-errors]:peer-invalid:border-red-500 group-[.show-errors]:peer-invalid:rounded"
            />
          </label>
          <label
            className="font-lato font-bold text-[12px] text-[#2B2520] cursor-pointer"
            htmlFor="completedTransfer"
          >
            I have transferred {formatCurrency(total)} from my bank account.
          </label>
        </div>
        <button
          type="submit"
          disabled={!isChecked || isSubmitting}
          className="mt-16 uppercase w-full bg-[#D4AF37] font-lato font-bold text-[14px] text-[#3D2645] px-5 py-3 rounded-lg hover:bg-[#b8962e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-5 w-5 text-[#3D2645]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Confirm Order"
          )}
        </button>
      </form>
    </div>
  );
}
