"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Loader2 } from "lucide-react";

export interface EmailEditorRef {
    exportHtml: (callback: (data: { design: any; html: string }) => void) => void;
    loadDesign: (design: any) => void;
}

interface EmailEditorWrapperProps {
    onLoad?: () => void;
    onReady?: () => void;
}

export const EmailEditorWrapper = forwardRef<EmailEditorRef, EmailEditorWrapperProps>(
    ({ onLoad, onReady }, ref) => {
        const [EmailEditor, setEmailEditor] = useState<any>(null);
        const editorRef = useRef<any>(null);

        useImperativeHandle(ref, () => ({
            exportHtml: (callback: (data: { design: any; html: string }) => void) => {
                if (editorRef.current && editorRef.current.editor) {
                    editorRef.current.editor.exportHtml(callback);
                }
            },
            loadDesign: (design: any) => {
                if (editorRef.current && editorRef.current.editor) {
                    editorRef.current.editor.loadDesign(design);
                }
            },
        }));

        useEffect(() => {
            // Dynamically import the email editor to avoid SSR issues
            import("react-email-editor")
                .then((mod) => {
                    setEmailEditor(() => mod.default);
                })
                .catch((err) => {
                    console.error("Failed to load email editor:", err);
                });
        }, []);

        const handleEditorLoad = () => {
            console.log("Unlayer editor loaded");
            if (onLoad) {
                onLoad();
            }
            if (onReady) {
                onReady();
            }
        };

        const handleEditorReady = (unlayer: any) => {
            console.log("Unlayer editor ready, registering custom tool");

            // Register custom placeholder tool
            unlayer.registerTool({
                name: 'merge_tag',
                label: 'Placeholder',
                icon: 'fa-user',
                supportedDisplayModes: ['web', 'email'],
                options: {
                    default: {
                        title: null
                    },
                    mergeTag: {
                        title: 'Merge Tag',
                        position: 1,
                        options: {
                            mergeTagType: {
                                label: 'Field',
                                defaultValue: '{{firstname}}',
                                widget: 'dropdown',
                                data: {
                                    options: [
                                        { label: 'First Name', value: '{{firstname}}' },
                                        { label: 'Last Name', value: '{{lastname}}' },
                                        { label: 'Email', value: '{{email}}' }
                                    ]
                                }
                            }
                        }
                    }
                },
                values: {},
                renderer: {
                    Viewer: (unlayer as any).createViewer({
                        render(values: any) {
                            return `<span style="color: #3b82f6; font-weight: 500;">${values.mergeTagType || '{{firstname}}'}</span>`;
                        }
                    }),
                    exporters: {
                        web(values: any) {
                            return `<span style="color: #3b82f6; font-weight: 500;">${values.mergeTagType || '{{firstname}}'}</span>`;
                        },
                        email(values: any) {
                            return values.mergeTagType || '{{firstname}}';
                        }
                    },
                    head: {
                        css(values: any) {
                            return '';
                        },
                        js(values: any) {
                            return '';
                        }
                    }
                }
            });

            if (onReady) {
                onReady();
            }
        };

        if (!EmailEditor) {
            return (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }

        // Configuration options for the email editor
        const editorOptions = {
            mergeTags: {
                firstname: {
                    name: "First Name",
                    value: "{{firstname}}",
                    sample: "John",
                },
                lastname: {
                    name: "Last Name",
                    value: "{{lastname}}",
                    sample: "Doe",
                },
                email: {
                    name: "Email",
                    value: "{{email}}",
                    sample: "john.doe@example.com",
                },
            },
        };

        return <EmailEditor ref={editorRef} onLoad={handleEditorLoad} onReady={handleEditorReady} options={editorOptions} />;
    }
);

EmailEditorWrapper.displayName = "EmailEditorWrapper";
