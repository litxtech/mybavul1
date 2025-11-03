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
                     <div className="text-gray-700 space-y-3">
                        <p>
                           To fix this for local development, create a <code className="bg-gray-200 text-gray-800 px-1 rounded">.env.local</code> file in the project root and add the missing variables.
                           Refer to the <code className="bg-gray-200 text-gray-800 px-1 rounded">README_setup.md</code> file for a template.
                        </p>
                        <p className="border-l-4 border-yellow-400 pl-4 bg-yellow-50 py-2">
                            <strong>Important:</strong> Following Vite's standard, all client-side environment variables **must** be prefixed with <code className="font-bold">VITE_</code>.
                            <br/>
                            For example: <code className="bg-gray-200 text-gray-800 px-1 rounded">VITE_SUPABASE_URL="..."</code>
                        </p>
                         <p>If you have deployed this application, please set these variables in your hosting provider's settings panel.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfigurationError;