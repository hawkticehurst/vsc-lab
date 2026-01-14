/**
 * Fake project data for workspace picker demo
 * Each project has a tree structure and code examples
 */

export const projectData = {
	"vscode-extension": {
		name: "vscode-extension",
		language: "typescript",
		tree: [
			{ type: "folder", name: "src", open: true, indent: 0 },
			{ type: "file", name: "extension.ts", indent: 1, active: true },
			{ type: "file", name: "commands.ts", indent: 1 },
			{ type: "file", name: "providers.ts", indent: 1 },
			{ type: "folder", name: "test", open: true, indent: 0 },
			{ type: "file", name: "extension.test.ts", indent: 1 },
			{ type: "file", name: "package.json", indent: 0 },
			{ type: "file", name: "tsconfig.json", indent: 0 },
			{ type: "file", name: "README.md", indent: 0 },
		],
		files: {
			"extension.ts": {
				language: "typescript",
				code: `import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { TreeDataProvider } from './providers';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension "my-extension" is now active!');

    // Register commands
    registerCommands(context);

    // Register tree view
    const treeProvider = new TreeDataProvider();
    vscode.window.registerTreeDataProvider('myExtensionView', treeProvider);

    // Register status bar item
    const statusBar = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBar.text = '$(zap) My Extension';
    statusBar.tooltip = 'Click to run command';
    statusBar.command = 'myExtension.run';
    statusBar.show();

    context.subscriptions.push(statusBar);
}

export function deactivate() {
    console.log('Extension "my-extension" is now deactivated');
}
`,
			},
			"commands.ts": {
				language: "typescript",
				code: `import * as vscode from 'vscode';

export function registerCommands(context: vscode.ExtensionContext) {
    const runCommand = vscode.commands.registerCommand(
        'myExtension.run',
        async () => {
            const result = await vscode.window.showQuickPick(
                ['Option 1', 'Option 2', 'Option 3'],
                { placeHolder: 'Select an option' }
            );
            
            if (result) {
                vscode.window.showInformationMessage(\`Selected: \${result}\`);
            }
        }
    );

    const helloCommand = vscode.commands.registerCommand(
        'myExtension.hello',
        () => {
            vscode.window.showInformationMessage('Hello from My Extension!');
        }
    );

    context.subscriptions.push(runCommand, helloCommand);
}
`,
			},
			"providers.ts": {
				language: "typescript",
				code: `import * as vscode from 'vscode';

export class TreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<TreeItem | undefined>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    private items: TreeItem[] = [
        new TreeItem('Item 1', vscode.TreeItemCollapsibleState.None),
        new TreeItem('Item 2', vscode.TreeItemCollapsibleState.None),
        new TreeItem('Item 3', vscode.TreeItemCollapsibleState.None),
    ];

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: TreeItem): Thenable<TreeItem[]> {
        if (!element) {
            return Promise.resolve(this.items);
        }
        return Promise.resolve([]);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }
}

class TreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.iconPath = new vscode.ThemeIcon('file');
    }
}
`,
			},
		},
	},

	"react-dashboard": {
		name: "react-dashboard",
		language: "typescript",
		tree: [
			{ type: "folder", name: "src", open: true, indent: 0 },
			{ type: "folder", name: "components", open: true, indent: 1 },
			{ type: "file", name: "Dashboard.tsx", indent: 2, active: true },
			{ type: "file", name: "Sidebar.tsx", indent: 2 },
			{ type: "file", name: "Chart.tsx", indent: 2 },
			{ type: "folder", name: "hooks", open: true, indent: 1 },
			{ type: "file", name: "useData.ts", indent: 2 },
			{ type: "file", name: "App.tsx", indent: 1 },
			{ type: "file", name: "package.json", indent: 0 },
			{ type: "file", name: "vite.config.ts", indent: 0 },
		],
		files: {
			"Dashboard.tsx": {
				language: "typescript",
				code: `import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Chart } from './Chart';
import { useData } from '../hooks/useData';
import './Dashboard.css';

interface DashboardProps {
    userId: string;
}

export function Dashboard({ userId }: DashboardProps) {
    const { data, loading, error } = useData(userId);
    const [selectedMetric, setSelectedMetric] = useState('revenue');

    if (loading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    if (error) {
        return <div className="dashboard-error">Error: {error}</div>;
    }

    return (
        <div className="dashboard">
            <Sidebar 
                metrics={data.metrics}
                selected={selectedMetric}
                onSelect={setSelectedMetric}
            />
            <main className="dashboard-content">
                <header className="dashboard-header">
                    <h1>Analytics Dashboard</h1>
                    <span className="last-updated">
                        Last updated: {data.lastUpdated}
                    </span>
                </header>
                <div className="dashboard-grid">
                    {data.charts.map(chart => (
                        <Chart 
                            key={chart.id}
                            type={chart.type}
                            data={chart.data}
                            title={chart.title}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
`,
			},
			"Sidebar.tsx": {
				language: "typescript",
				code: `interface SidebarProps {
    metrics: Metric[];
    selected: string;
    onSelect: (metric: string) => void;
}

interface Metric {
    id: string;
    name: string;
    value: number;
    change: number;
}

export function Sidebar({ metrics, selected, onSelect }: SidebarProps) {
    return (
        <aside className="sidebar">
            <nav className="sidebar-nav">
                <h2>Metrics</h2>
                <ul>
                    {metrics.map(metric => (
                        <li 
                            key={metric.id}
                            className={selected === metric.id ? 'active' : ''}
                            onClick={() => onSelect(metric.id)}
                        >
                            <span className="metric-name">{metric.name}</span>
                            <span className="metric-value">
                                {metric.value.toLocaleString()}
                            </span>
                            <span className={\`metric-change \${metric.change >= 0 ? 'positive' : 'negative'}\`}>
                                {metric.change >= 0 ? '+' : ''}{metric.change}%
                            </span>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
`,
			},
			"useData.ts": {
				language: "typescript",
				code: `import { useState, useEffect } from 'react';

interface DashboardData {
    metrics: Metric[];
    charts: ChartData[];
    lastUpdated: string;
}

export function useData(userId: string) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch(\`/api/dashboard/\${userId}\`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [userId]);

    return { data, loading, error };
}
`,
			},
		},
	},

	"api-server": {
		name: "api-server",
		language: "typescript",
		tree: [
			{ type: "folder", name: "src", open: true, indent: 0 },
			{ type: "folder", name: "routes", open: true, indent: 1 },
			{ type: "file", name: "users.ts", indent: 2, active: true },
			{ type: "file", name: "posts.ts", indent: 2 },
			{ type: "folder", name: "middleware", open: true, indent: 1 },
			{ type: "file", name: "auth.ts", indent: 2 },
			{ type: "file", name: "index.ts", indent: 1 },
			{ type: "file", name: "package.json", indent: 0 },
			{ type: "file", name: "tsconfig.json", indent: 0 },
		],
		files: {
			"users.ts": {
				language: "typescript",
				code: `import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get all users
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user by ID
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: { posts: true },
        });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create user
router.post('/', async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    
    try {
        const user = await prisma.user.create({
            data: { email, name, password },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create user' });
    }
});

export default router;
`,
			},
			"auth.ts": {
				language: "typescript",
				code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface AuthRequest extends Request {
    userId?: string;
}

export function authMiddleware(
    req: AuthRequest, 
    res: Response, 
    next: NextFunction
) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    const [bearer, token] = authHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Invalid token format' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

export function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}
`,
			},
			"index.ts": {
				language: "typescript",
				code: `import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(\`Server running on port \${PORT}\`);
});

export default app;
`,
			},
		},
	},

	"mobile-app": {
		name: "mobile-app",
		language: "typescript",
		tree: [
			{ type: "folder", name: "src", open: true, indent: 0 },
			{ type: "folder", name: "screens", open: true, indent: 1 },
			{ type: "file", name: "HomeScreen.tsx", indent: 2, active: true },
			{ type: "file", name: "ProfileScreen.tsx", indent: 2 },
			{ type: "folder", name: "components", open: true, indent: 1 },
			{ type: "file", name: "Button.tsx", indent: 2 },
			{ type: "file", name: "Card.tsx", indent: 2 },
			{ type: "file", name: "App.tsx", indent: 1 },
			{ type: "file", name: "package.json", indent: 0 },
			{ type: "file", name: "app.json", indent: 0 },
		],
		files: {
			"HomeScreen.tsx": {
				language: "typescript",
				code: `import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';

export function HomeScreen() {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = React.useState(false);
    const [data, setData] = React.useState<Item[]>([]);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            const response = await fetch('/api/items');
            const items = await response.json();
            setData(items);
        } finally {
            setRefreshing(false);
        }
    }, []);

    React.useEffect(() => {
        onRefresh();
    }, []);

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Here's what's new today</Text>
            </View>

            <View style={styles.cards}>
                {data.map(item => (
                    <Card 
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        onPress={() => navigation.navigate('Details', { id: item.id })}
                    />
                ))}
            </View>

            <Button 
                title="View Profile"
                onPress={() => navigation.navigate('Profile')}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    cards: {
        padding: 16,
        gap: 12,
    },
});
`,
			},
			"Button.tsx": {
				language: "typescript",
				code: `import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
}

export function Button({ 
    title, 
    onPress, 
    variant = 'primary',
    loading = false,
    disabled = false 
}: ButtonProps) {
    const buttonStyle = [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
    ];

    const textStyle = [
        styles.text,
        variant === 'outline' && styles.outlineText,
    ];

    return (
        <TouchableOpacity 
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#007AFF' : '#fff'} />
            ) : (
                <Text style={textStyle}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    primary: {
        backgroundColor: '#007AFF',
    },
    secondary: {
        backgroundColor: '#5856D6',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    disabled: {
        opacity: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    outlineText: {
        color: '#007AFF',
    },
});
`,
			},
			"Card.tsx": {
				language: "typescript",
				code: `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CardProps {
    title: string;
    description: string;
    onPress?: () => void;
    image?: string;
}

export function Card({ title, description, onPress, image }: CardProps) {
    const content = (
        <View style={styles.card}>
            {image && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} />
                </View>
            )}
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {description}
                </Text>
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    imageContainer: {
        height: 160,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});
`,
			},
		},
	},

	"ml-pipeline": {
		name: "ml-pipeline",
		language: "python",
		tree: [
			{ type: "folder", name: "src", open: true, indent: 0 },
			{ type: "file", name: "train.py", indent: 1, active: true },
			{ type: "file", name: "model.py", indent: 1 },
			{ type: "file", name: "data.py", indent: 1 },
			{ type: "folder", name: "tests", open: true, indent: 0 },
			{ type: "file", name: "test_model.py", indent: 1 },
			{ type: "file", name: "requirements.txt", indent: 0 },
			{ type: "file", name: "config.yaml", indent: 0 },
		],
		files: {
			"train.py": {
				language: "python",
				code: `import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from model import TransformerModel
from data import TextDataset
import yaml
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def train(config_path: str = "config.yaml"):
    """Main training loop."""
    with open(config_path) as f:
        config = yaml.safe_load(f)
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Using device: {device}")
    
    # Initialize dataset and dataloader
    dataset = TextDataset(
        data_path=config["data"]["path"],
        max_length=config["data"]["max_length"],
    )
    dataloader = DataLoader(
        dataset,
        batch_size=config["training"]["batch_size"],
        shuffle=True,
        num_workers=4,
    )
    
    # Initialize model
    model = TransformerModel(
        vocab_size=dataset.vocab_size,
        d_model=config["model"]["d_model"],
        nhead=config["model"]["nhead"],
        num_layers=config["model"]["num_layers"],
        dropout=config["model"]["dropout"],
    ).to(device)
    
    optimizer = torch.optim.AdamW(
        model.parameters(),
        lr=config["training"]["learning_rate"],
        weight_decay=config["training"]["weight_decay"],
    )
    criterion = nn.CrossEntropyLoss()
    
    # Training loop
    for epoch in range(config["training"]["epochs"]):
        model.train()
        total_loss = 0
        
        for batch_idx, (inputs, targets) in enumerate(dataloader):
            inputs, targets = inputs.to(device), targets.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs.view(-1, dataset.vocab_size), targets.view(-1))
            loss.backward()
            
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            
            total_loss += loss.item()
            
            if batch_idx % 100 == 0:
                logger.info(f"Epoch {epoch}, Batch {batch_idx}, Loss: {loss.item():.4f}")
        
        avg_loss = total_loss / len(dataloader)
        logger.info(f"Epoch {epoch} complete. Average loss: {avg_loss:.4f}")
        
        # Save checkpoint
        checkpoint_path = Path(config["training"]["checkpoint_dir"]) / f"model_epoch_{epoch}.pt"
        torch.save(model.state_dict(), checkpoint_path)


if __name__ == "__main__":
    train()
`,
			},
			"model.py": {
				language: "python",
				code: `import torch
import torch.nn as nn
import math


class PositionalEncoding(nn.Module):
    """Positional encoding for transformer."""
    
    def __init__(self, d_model: int, max_len: int = 5000, dropout: float = 0.1):
        super().__init__()
        self.dropout = nn.Dropout(p=dropout)
        
        position = torch.arange(max_len).unsqueeze(1)
        div_term = torch.exp(
            torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model)
        )
        
        pe = torch.zeros(max_len, 1, d_model)
        pe[:, 0, 0::2] = torch.sin(position * div_term)
        pe[:, 0, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x + self.pe[:x.size(0)]
        return self.dropout(x)


class TransformerModel(nn.Module):
    """Transformer-based language model."""
    
    def __init__(
        self,
        vocab_size: int,
        d_model: int = 512,
        nhead: int = 8,
        num_layers: int = 6,
        dropout: float = 0.1,
    ):
        super().__init__()
        self.d_model = d_model
        
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.pos_encoder = PositionalEncoding(d_model, dropout=dropout)
        
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=d_model * 4,
            dropout=dropout,
            batch_first=True,
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers)
        self.output = nn.Linear(d_model, vocab_size)
        
        self._init_weights()
    
    def _init_weights(self):
        init_range = 0.1
        self.embedding.weight.data.uniform_(-init_range, init_range)
        self.output.bias.data.zero_()
        self.output.weight.data.uniform_(-init_range, init_range)
    
    def forward(self, src: torch.Tensor) -> torch.Tensor:
        src = self.embedding(src) * math.sqrt(self.d_model)
        src = self.pos_encoder(src)
        output = self.transformer(src)
        return self.output(output)
`,
			},
			"data.py": {
				language: "python",
				code: `import torch
from torch.utils.data import Dataset
from pathlib import Path
from typing import Tuple
import json


class TextDataset(Dataset):
    """Dataset for text data."""
    
    def __init__(self, data_path: str, max_length: int = 512):
        self.max_length = max_length
        self.data_path = Path(data_path)
        
        # Load or build vocabulary
        vocab_path = self.data_path.parent / "vocab.json"
        if vocab_path.exists():
            with open(vocab_path) as f:
                self.vocab = json.load(f)
        else:
            self.vocab = self._build_vocab()
            with open(vocab_path, "w") as f:
                json.dump(self.vocab, f)
        
        self.vocab_size = len(self.vocab)
        self.token_to_id = {t: i for i, t in enumerate(self.vocab)}
        self.id_to_token = {i: t for i, t in enumerate(self.vocab)}
        
        # Load data
        self.samples = self._load_data()
    
    def _build_vocab(self) -> list:
        """Build vocabulary from data."""
        tokens = set()
        with open(self.data_path) as f:
            for line in f:
                tokens.update(line.strip().split())
        return ["<pad>", "<unk>", "<bos>", "<eos>"] + sorted(tokens)
    
    def _load_data(self) -> list:
        """Load and tokenize data."""
        samples = []
        with open(self.data_path) as f:
            for line in f:
                tokens = line.strip().split()
                if len(tokens) > 1:
                    ids = [self.token_to_id.get(t, 1) for t in tokens]
                    samples.append(ids)
        return samples
    
    def __len__(self) -> int:
        return len(self.samples)
    
    def __getitem__(self, idx: int) -> Tuple[torch.Tensor, torch.Tensor]:
        tokens = self.samples[idx]
        
        # Pad or truncate
        if len(tokens) < self.max_length:
            tokens = tokens + [0] * (self.max_length - len(tokens))
        else:
            tokens = tokens[:self.max_length]
        
        inputs = torch.tensor(tokens[:-1], dtype=torch.long)
        targets = torch.tensor(tokens[1:], dtype=torch.long)
        
        return inputs, targets
`,
			},
		},
	},

	"design-system": {
		name: "design-system",
		language: "typescript",
		tree: [
			{ type: "folder", name: "src", open: true, indent: 0 },
			{ type: "folder", name: "tokens", open: true, indent: 1 },
			{ type: "file", name: "colors.ts", indent: 2, active: true },
			{ type: "file", name: "spacing.ts", indent: 2 },
			{ type: "file", name: "typography.ts", indent: 2 },
			{ type: "folder", name: "components", open: true, indent: 1 },
			{ type: "file", name: "Button.tsx", indent: 2 },
			{ type: "file", name: "Input.tsx", indent: 2 },
			{ type: "file", name: "index.ts", indent: 1 },
			{ type: "file", name: "package.json", indent: 0 },
		],
		files: {
			"colors.ts": {
				language: "typescript",
				code: `/**
 * Design System Color Tokens
 * 
 * These colors form the foundation of our visual language.
 * Use semantic tokens for components, not raw color values.
 */

// Primitive colors
export const primitives = {
  // Neutrals
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  
  // Primary brand color
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  
  // Success
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  
  // Warning
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  
  // Error
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
} as const;

// Semantic tokens for light mode
export const lightTheme = {
  background: {
    primary: primitives.gray[50],
    secondary: primitives.gray[100],
    tertiary: primitives.gray[200],
    inverse: primitives.gray[900],
  },
  foreground: {
    primary: primitives.gray[900],
    secondary: primitives.gray[600],
    tertiary: primitives.gray[500],
    inverse: primitives.gray[50],
  },
  border: {
    default: primitives.gray[200],
    strong: primitives.gray[300],
    focus: primitives.blue[500],
  },
  interactive: {
    primary: primitives.blue[600],
    primaryHover: primitives.blue[700],
    primaryActive: primitives.blue[800],
  },
  status: {
    success: primitives.green[600],
    warning: primitives.amber[600],
    error: primitives.red[600],
  },
} as const;

// Semantic tokens for dark mode
export const darkTheme = {
  background: {
    primary: primitives.gray[950],
    secondary: primitives.gray[900],
    tertiary: primitives.gray[800],
    inverse: primitives.gray[50],
  },
  foreground: {
    primary: primitives.gray[50],
    secondary: primitives.gray[400],
    tertiary: primitives.gray[500],
    inverse: primitives.gray[900],
  },
  border: {
    default: primitives.gray[800],
    strong: primitives.gray[700],
    focus: primitives.blue[400],
  },
  interactive: {
    primary: primitives.blue[500],
    primaryHover: primitives.blue[400],
    primaryActive: primitives.blue[300],
  },
  status: {
    success: primitives.green[500],
    warning: primitives.amber[500],
    error: primitives.red[500],
  },
} as const;

export type Theme = typeof lightTheme;
`,
			},
			"Button.tsx": {
				language: "typescript",
				code: `import React from 'react';
import styled, { css } from 'styled-components';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles = {
  sm: css\`
    height: 32px;
    padding: 0 \${spacing[3]};
    font-size: \${typography.fontSize.sm};
  \`,
  md: css\`
    height: 40px;
    padding: 0 \${spacing[4]};
    font-size: \${typography.fontSize.base};
  \`,
  lg: css\`
    height: 48px;
    padding: 0 \${spacing[6]};
    font-size: \${typography.fontSize.lg};
  \`,
};

const StyledButton = styled.button<ButtonProps>\`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: \${spacing[2]};
  border-radius: \${spacing[2]};
  font-weight: \${typography.fontWeight.medium};
  transition: all 150ms ease;
  cursor: pointer;
  
  \${({ size = 'md' }) => sizeStyles[size]}
  \${({ fullWidth }) => fullWidth && css\`width: 100%;\`}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
\`;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </StyledButton>
  );
}
`,
			},
			"spacing.ts": {
				language: "typescript",
				code: `/**
 * Design System Spacing Tokens
 * 
 * Based on a 4px base unit for consistency.
 * Use these values for margin, padding, and gap.
 */

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
} as const;

export type SpacingKey = keyof typeof spacing;
export type SpacingValue = typeof spacing[SpacingKey];
`,
			},
		},
	},

	"blog-platform": {
		name: "blog-platform",
		language: "typescript",
		tree: [
			{ type: "folder", name: "app", open: true, indent: 0 },
			{ type: "file", name: "page.tsx", indent: 1, active: true },
			{ type: "file", name: "layout.tsx", indent: 1 },
			{ type: "folder", name: "posts", open: true, indent: 1 },
			{ type: "file", name: "[slug]", indent: 2 },
			{ type: "folder", name: "components", open: true, indent: 0 },
			{ type: "file", name: "Header.tsx", indent: 1 },
			{ type: "file", name: "PostCard.tsx", indent: 1 },
			{ type: "file", name: "package.json", indent: 0 },
			{ type: "file", name: "next.config.js", indent: 0 },
		],
		files: {
			"page.tsx": {
				language: "typescript",
				code: `import { Suspense } from 'react';
import { PostCard } from '@/components/PostCard';
import { getPosts } from '@/lib/posts';
import styles from './page.module.css';

export const metadata = {
  title: 'My Blog',
  description: 'Thoughts on web development and design',
};

async function PostList() {
  const posts = await getPosts();
  
  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          slug={post.slug}
          title={post.title}
          excerpt={post.excerpt}
          date={post.date}
          readingTime={post.readingTime}
          coverImage={post.coverImage}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to My Blog</h1>
        <p className={styles.subtitle}>
          Exploring ideas in web development, design systems, and technology.
        </p>
      </section>
      
      <section className={styles.posts}>
        <h2 className={styles.sectionTitle}>Latest Posts</h2>
        <Suspense fallback={<PostsSkeleton />}>
          <PostList />
        </Suspense>
      </section>
    </main>
  );
}

function PostsSkeleton() {
  return (
    <div className={styles.grid}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}
`,
			},
			"Header.tsx": {
				language: "typescript",
				code: `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import styles from './Header.module.css';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✍️</span>
          <span className={styles.logoText}>Blog</span>
        </Link>
        
        <nav className={styles.nav}>
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={\`\${styles.navLink} \${pathname === href ? styles.active : ''}\`}
            >
              {label}
            </Link>
          ))}
        </nav>
        
        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
`,
			},
			"PostCard.tsx": {
				language: "typescript",
				code: `import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import styles from './PostCard.module.css';

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: number;
  coverImage?: string;
}

export function PostCard({
  slug,
  title,
  excerpt,
  date,
  readingTime,
  coverImage,
}: PostCardProps) {
  return (
    <article className={styles.card}>
      {coverImage && (
        <Link href={\`/posts/\${slug}\`} className={styles.imageLink}>
          <Image
            src={coverImage}
            alt={title}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <time dateTime={date}>{formatDate(date)}</time>
          <span className={styles.separator}>·</span>
          <span>{readingTime} min read</span>
        </div>
        
        <Link href={\`/posts/\${slug}\`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>
        
        <p className={styles.excerpt}>{excerpt}</p>
        
        <Link href={\`/posts/\${slug}\`} className={styles.readMore}>
          Read more →
        </Link>
      </div>
    </article>
  );
}
`,
			},
		},
	},

	"cli-tool": {
		name: "cli-tool",
		language: "go",
		tree: [
			{ type: "folder", name: "cmd", open: true, indent: 0 },
			{ type: "file", name: "root.go", indent: 1, active: true },
			{ type: "file", name: "init.go", indent: 1 },
			{ type: "file", name: "run.go", indent: 1 },
			{ type: "folder", name: "internal", open: true, indent: 0 },
			{ type: "file", name: "config.go", indent: 1 },
			{ type: "file", name: "runner.go", indent: 1 },
			{ type: "file", name: "main.go", indent: 0 },
			{ type: "file", name: "go.mod", indent: 0 },
		],
		files: {
			"root.go": {
				language: "go",
				code: `package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	cfgFile string
	verbose bool
)

var rootCmd = &cobra.Command{
	Use:   "mytool",
	Short: "A powerful CLI tool for developers",
	Long: \`mytool is a CLI application that helps developers
automate common tasks and streamline their workflow.

It provides commands for project initialization, 
running tasks, and managing configurations.\`,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		if verbose {
			fmt.Println("Verbose mode enabled")
		}
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.mytool.yaml)")
	rootCmd.PersistentFlags().BoolVarP(&verbose, "verbose", "v", false, "verbose output")
	
	viper.BindPFlag("verbose", rootCmd.PersistentFlags().Lookup("verbose"))
}

func initConfig() {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		home, err := os.UserHomeDir()
		cobra.CheckErr(err)

		viper.AddConfigPath(home)
		viper.AddConfigPath(".")
		viper.SetConfigType("yaml")
		viper.SetConfigName(".mytool")
	}

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		if verbose {
			fmt.Println("Using config file:", viper.ConfigFileUsed())
		}
	}
}
`,
			},
			"init.go": {
				language: "go",
				code: `package cmd

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

var (
	projectName string
	template    string
)

var initCmd = &cobra.Command{
	Use:   "init [directory]",
	Short: "Initialize a new project",
	Long: \`Initialize a new project with the specified template.

Available templates:
  - basic: A minimal project structure
  - web: Web application with frontend and backend
  - api: REST API server
  - cli: CLI application\`,
	Args: cobra.MaximumNArgs(1),
	RunE: runInit,
}

func init() {
	rootCmd.AddCommand(initCmd)

	initCmd.Flags().StringVarP(&projectName, "name", "n", "", "project name")
	initCmd.Flags().StringVarP(&template, "template", "t", "basic", "project template")
}

func runInit(cmd *cobra.Command, args []string) error {
	dir := "."
	if len(args) > 0 {
		dir = args[0]
	}

	absDir, err := filepath.Abs(dir)
	if err != nil {
		return fmt.Errorf("failed to resolve directory: %w", err)
	}

	if projectName == "" {
		projectName = filepath.Base(absDir)
	}

	fmt.Printf("Initializing project '%s' with template '%s'\\n", projectName, template)

	// Create project structure
	dirs := []string{
		"cmd",
		"internal",
		"pkg",
		"configs",
	}

	for _, d := range dirs {
		path := filepath.Join(absDir, d)
		if err := os.MkdirAll(path, 0755); err != nil {
			return fmt.Errorf("failed to create directory %s: %w", d, err)
		}
		fmt.Printf("  Created %s/\\n", d)
	}

	fmt.Println("\\nProject initialized successfully!")
	fmt.Printf("  cd %s\\n", dir)
	fmt.Println("  mytool run")

	return nil
}
`,
			},
			"config.go": {
				language: "go",
				code: `package internal

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

// Config holds the application configuration.
type Config struct {
	Name        string            \`yaml:"name"\`
	Version     string            \`yaml:"version"\`
	Description string            \`yaml:"description"\`
	Tasks       map[string]Task   \`yaml:"tasks"\`
	Env         map[string]string \`yaml:"env"\`
}

// Task represents a runnable task.
type Task struct {
	Name        string   \`yaml:"name"\`
	Description string   \`yaml:"description"\`
	Command     string   \`yaml:"command"\`
	Args        []string \`yaml:"args"\`
	Env         map[string]string \`yaml:"env"\`
	DependsOn   []string \`yaml:"depends_on"\`
}

// LoadConfig loads configuration from a file.
func LoadConfig(path string) (*Config, error) {
	if path == "" {
		// Try default locations
		candidates := []string{
			"mytool.yaml",
			"mytool.yml",
			".mytool.yaml",
			".mytool.yml",
		}
		
		for _, c := range candidates {
			if _, err := os.Stat(c); err == nil {
				path = c
				break
			}
		}
	}

	if path == "" {
		return nil, fmt.Errorf("no configuration file found")
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}

	return &config, nil
}

// SaveConfig saves configuration to a file.
func SaveConfig(config *Config, path string) error {
	data, err := yaml.Marshal(config)
	if err != nil {
		return fmt.Errorf("failed to marshal config: %w", err)
	}

	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return fmt.Errorf("failed to create directory: %w", err)
	}

	if err := os.WriteFile(path, data, 0644); err != nil {
		return fmt.Errorf("failed to write config file: %w", err)
	}

	return nil
}
`,
			},
		},
	},
};

/**
 * Get the default/active file for a project
 */
export function getActiveFile(projectId) {
	const project = projectData[projectId];
	if (!project) return null;

	const activeItem = project.tree.find((item) => item.active);
	return activeItem ? activeItem.name : null;
}

/**
 * Get the code for a specific file in a project
 */
export function getFileCode(projectId, filename) {
	const project = projectData[projectId];
	if (!project || !project.files[filename]) return null;

	return project.files[filename];
}
