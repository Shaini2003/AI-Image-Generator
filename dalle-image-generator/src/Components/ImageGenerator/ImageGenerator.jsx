import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';
import { InferenceClient } from '@huggingface/inference';

const ImageGenerator = () => {
    const [imageURL, setImageURL] = useState("/");
    const inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const client = new InferenceClient({
        token: 'YOUR_VALID_HF_API_KEY', // Replace with your valid Hugging Face API key
    });

    const imageGenerator = async () => {
        const prompt = inputRef.current.value.trim();
        if (!prompt) {
            alert("Please enter a prompt.");
            return;
        }

        setLoading(true);

        try {
            const response = await client.textToImage({
                model: 'runwayml/stable-diffusion-v1-5', // Use a supported model
                prompt: prompt,
                parameters: {
                    num_inference_steps: 50,
                    guidance_scale: 7.5,
                },
            });

            // Assuming response is a Blob (InferenceClient returns binary data)
            const imageObjectURL = URL.createObjectURL(response);
            setImageURL(imageObjectURL);
        } catch (error) {
            console.error("Image generation error:", error);
            alert(`Error: ${error.message}. Please check your API key, model, or try again later.`);
            setImageURL("/");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='ai-image-generator'>
            <div className="header">AI Image <span>Generator</span></div>

            <div className="img-loading">
                <div className="image">
                    <img src={imageURL === "/" ? default_image : imageURL} alt="AI Generated Result" />
                </div>
                <div className="loading">
                    <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
                    <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
                </div>
            </div>

            <div className="search-box">
                <input
                    type="text"
                    ref={inputRef}
                    className="search-input"
                    placeholder='Describe what you want to see...'
                />
                <div className="generate-btn" onClick={imageGenerator}>Generate</div>
            </div>
        </div>
    );
};

export default ImageGenerator;