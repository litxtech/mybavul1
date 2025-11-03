import React from 'react';

const MissingEnvVar: React.FC<{ varName: string }> = ({ varName }) => (
    <li className="mb-2">
        Missing <code className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-sm">{varName}</code>
    </li>
);

const ConfigurationError: React.FC<{ missingVars: string[] }> = ({ missingVars }) => {
    return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full border-t-4 border-red-500">
                <h1 className="text-2xl font-bold text-red-800 mb-4">Application Configuration Error</h1>
                <p className="text-gray-700 mb-6">
                    The application cannot start because some critical environment variables are missing. These are required to connect to essential services like your database and payment provider.
                </p>
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                    <h2 className="font-semibold text-lg mb-3">Missing Variables:</h2>
                    <ul className="list-disc list-inside text-red-700">
                        {missingVars.map(varName => <MissingEnvVar key={varName} varName={varName} />)}
                    </ul>
                </div>
                <div className="mt-6">
                    <h2 className="font-semibold text-lg mb-3">How to Fix This:</h2>
                    <p className="text-gray-700">
                        Please refer to the <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm">README_setup.md</code> file for instructions on how to set these variables in your hosting environment (e.g., Vercel, Netlify) or in a local <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm">.env</code> file for development.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ConfigurationError;
