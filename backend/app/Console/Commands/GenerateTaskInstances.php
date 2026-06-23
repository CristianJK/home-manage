<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Services\TaskService;
use Illuminate\Console\Command;

final class GenerateTaskInstances extends Command
{
    protected $signature = 'tasks:generate-instances';
    protected $description = 'Generate pending task instances for recurring tasks';

    public function handle(TaskService $taskService): int
    {
        $taskService->generatePendingInstances();

        $this->info('Task instances generated successfully.');

        return self::SUCCESS;
    }
}
