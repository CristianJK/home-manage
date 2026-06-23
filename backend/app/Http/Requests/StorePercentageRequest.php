<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StorePercentageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'users' => ['required', 'array', 'min:1'],
            'users.*.user_id' => ['required', 'exists:users,id'],
            'users.*.percentage' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'users.required' => 'Debe proporcionar al menos un usuario.',
            'users.*.percentage.required' => 'El porcentaje es obligatorio para cada usuario.',
        ];
    }
}
