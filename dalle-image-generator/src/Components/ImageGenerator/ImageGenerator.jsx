import React, { useRef, useState } from 'react';
import './ImageGenerator.css';
import default_image from '../Assets/default_image.svg';

const imageGenerator = async () => {
    const prompt = inputRef.current.value.trim();
    if (!prompt) {
        alert("Please enter a prompt.");
        return;
    }

    setLoading(true);

    try {
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer sk-...", // your valid key
                },
                body: JSON.stringify({
                    prompt: prompt,
                    n: 1,
                    size: "512x512",
                }),
            }
        );

        const data = await response.json();
        console.log("API response:", data); // Debug info

        if (data.error) {
            console.error("OpenAI API error:", data.error);
            alert("OpenAI Error: " + data.error.message);
            setLoading(false);
            return;
        }

        if (data && data.data && data.data.length > 0) {
            setImage_url(data.data[0].url);
        } else {
            console.warn("No image data returned.");
            alert("No image generated. Try again with a different prompt.");
            setImage_url("/");
        }

    } catch (error) {
        console.error("Image generation error:", error);
        alert("Something went wrong. Please try again.");
        setImage_url("/");
    }

    setLoading(false);


    return (
        <div className='ai-image-generator'>
            <div className="header">AI Image <span>Generator</span></div>

            <div className="img-loading">
                <div className="image">
                    <img src={image_url === "/" ? default_image : image_url} alt="AI Generated Result" />
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
