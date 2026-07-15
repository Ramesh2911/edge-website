// components/LocationMap.jsx
export default function LocationMap() {
    return (
        <div id="map" className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Flagship Showrooms</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Visit us globally or coordinate localized site tours.</p>
            </div>
            <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 relative bg-slate-200 dark:bg-slate-800">
                {/* Production Google Maps Dynamic Iframe Deployment */}
                <iframe
                    title="Flagship Office Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.9732!3d40.7644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ1JzUxLjgiTiA3M8KwNTgnMjMuNSJX!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full filter grayscale dark:invert-[0.9] dark:hue-rotate-180"
                />
            </div>
        </div>
    );
}